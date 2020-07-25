const $ = require("jquery");
const dialog = require("electron").remote.dialog;
const fs = require("fs");
$(document).ready(function () {
    // console.log("Jquery loaded on ui");
    let db;
    let lsc;
    $("#grid .cell").on("click", function () {
        let rId = Number($(this).attr("rowId")) + 1;
        let cId = Number($(this).attr("colId")) + 65;
        let address = String.fromCharCode(cId) + rId;
        // input => value attribute
        $("#address-input").val(address);
        let { rowId, colId } = getRcfromElem(this);
        let cellObject = db[rowId][colId];
        $("#formula-input").val(cellObject.formula);
        lsc = this;
    })
    $("#cell-container").on("scroll", function () {
        let vS = $(this).scrollTop();
        let hS = $(this).scrollLeft();
        console.log(vS + " " + hS)
        $("#tl-cell,#top-row").css("top", vS);
        $("#tl-cell,#left-col").css("left", hS);
    })
    $("#grid .cell").on("keyup", function () {
        let height = $(this).height();
        let cRowId = $(this).attr("rowId");
        let cellNumberElem = $("#left-col .cell")[cRowId];
        $(cellNumberElem).css("height", height);
    })

    $(".menu").on("click", function () {
        let menuName = $(this).attr("id");

        $(".menu-options").removeClass("active");
        $("#" + menuName + "-menu-options").addClass("active");
    })

    // **********************Formatting**************************
    $("#bold").on("click", function () {
        let { rowId, colId } = getRcfromElem(lsc);
        console.log(db);
        let cellObject = db[rowId][colId];
        let isBold = cellObject.bold;
        $(lsc).css("font-weight", isBold ? "normal" : "bold");
        cellObject.bold = !isBold;
    })
    // *****************************New-Open-Save***************
    $("#New").on("click", function () {
        db = []
        let allRows = $("#grid .row");
        for (let i = 0; i < allRows.length; i++) {
            let row = [];
            let allCellsofaR = $(allRows[i]).find(".cell");
            for (let j = 0; j < allCellsofaR.length; j++) {
                $(allCellsofaR[j]).html("");
                // text-decoration : underline,none
                // font-style : italic: normal
                // font-size
                // font-family
                // color
                // background-color
                let cell = {
                    value: "",
                    bold: false,
                    italic: false,
                    underline: false,
                    fontSize: 12,
                    color: "black",
                    fontFamily: "cursive",
                    bColor: "white",
                    formula: "",
                    children: [],
                    parent: []

                };
                row.push(cell);
            }
            db.push(row);
        }
        console.log(db);
    })
    $("#Save").on("click", function () {
        // console.log(db);
        let fPath = dialog.showSaveDialogSync();
        let sData = JSON.stringify(db);
        fs.writeFileSync(fPath, sData);
        alert("File saved");
        // open dialog box 
        // save db into a file
    })
    $("#Open").on("click", function () {
        // open dialog box
        let fPaths = dialog.showOpenDialogSync();
        // read the file
        console.log(fPaths);
        let buffer = fs.readFileSync(fPaths[0]);
        // load the file
        db = JSON.parse(buffer);
        // console.log(db);
        let allRows = $("#grid .row");
        for (let i = 0; i < allRows.length; i++) {
            let allCellsofaR = $(allRows[i]).find(".cell");
            for (let j = 0; j < allCellsofaR.length; j++) {
                $(allCellsofaR[j]).html(db[i][j].value);

                // row.push(cell);
            }
        }
    })
    // ************************Formula*******************************
    $("#grid .cell").on("blur", function () {
        let { rowId, colId } = getRcfromElem(this);
        let cellObject = db[rowId][colId];
        // "",false,null,undefined,0
        let address = $("#address-input").val();
        if (cellObject.formula) {
            removeFormula(cellObject, address);
        }
        let val = $(this).html();
        updateCell(rowId, colId, val);
    })
    $("#formula-input").on("blur", function () {
        // to get data from input use val
        let formula = $(this).val();
        // console.log(formula);
        let address = $("#address-input").val();
        let { rowId, colId } = getRCfromAddress(address);
        let cellObject = db[rowId][colId];
        // isFormulaValid
        if (cellObject.formula) {
            removeFormula(cellObject, address);
        }
        cellObject.formula = formula;
        let ans = evaluate(formula);
        // alert(ans);
        // console.log(rowId + " " + colId);
        setupFormula(formula, address, cellObject);
        updateCell(rowId, colId, ans);
    })

    function evaluate(formula) {
        // ( A1 + A2 )
        let fComp = formula.split(" ");
        // [(,A1,+,A2,)]
        console.log(fComp)
        for (let i = 0; i < fComp.length; i++) {
            let elem = fComp[i];
            let charCode = elem.charCodeAt(0);
            if (charCode >= 65 && charCode <= 90) {
                // valid cell
                let { rowId, colId } = getRCfromAddress(fComp[i]);
                let val = db[rowId][colId].value;
                formula = formula.replace(fComp[i], val);
            }

        }

        // infix evaluation 
        let ans = eval(formula);
        return ans;

    }
    function updateCell(rowId, colId, ans) {
        $(`#grid .cell[rowId=${rowId}][colId=${colId}]`).html(ans);
        let cellObject = db[rowId][colId];
        cellObject.value = ans;
        //tell your childrens to update themselves  
        for (let i = 0; i < cellObject.children.length; i++) {
            let cAddress = cellObject.children[i];
            let chObject = getRCfromAddress(cAddress);
            let chCellObject = db[chObject.rowId][chObject.colId];
            let ans = evaluate(chCellObject.formula);
            updateCell(chObject.rowId, chObject.colId, ans)
        }
    }
    function setupFormula(formula, address, cellObject) {
        // go to parent
        // add yourself to parent
        let fComp = formula.split(" ");
        // [(,A1,+,A2,)]
        console.log(fComp)
        for (let i = 0; i < fComp.length; i++) {
            let elem = fComp[i];
            let charCode = elem.charCodeAt(0);
            if (charCode >= 65 && charCode <= 90) {
                // valid cell
                let { rowId, colId } = getRCfromAddress(fComp[i]);
                let children = db[rowId][colId].children;
                children.push(address);
                cellObject.parent.push(fComp[i]);
            }

        }
    }

    function removeFormula(cellObject, caddress) {
        //  remove yourself from parent
        for (let i = 0; i < cellObject.parent.length; i++) {
            let parentAddr = cellObject.parent[i];
            let { rowId, colId } = getRCfromAddress(parentAddr);
            let pObject = db[rowId][colId];
            // let newArr = pObject.children.filter()


            let nArr = pObject.children.filter(function (elem) {
                return elem != caddress;
            });
pObject.children=nArr;
        }

        cellObject.parent = [];

        cellObject.formula = "";
    }

    // **************helper fn*************************
    function getRCfromAddress(address) {
        let charCode = address.charCodeAt(0);
        let colId = Number(charCode) - 65;
        let rowId = Number(address.substring(1)) - 1;
        return { colId, rowId };
    }
    function getRcfromElem(elem) {
        let rowId = $(elem).attr("rowId");
        let colId = $(elem).attr("colId");
        return {
            rowId,
            colId
        }
    }
    // ********************init******************************************
    function init() {
        $("#File").trigger("click");
        $("#New").trigger("click");
    }
    init();
})