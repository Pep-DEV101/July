const $ = require("jquery");
const dialog = require("electron").remote.dialog;
const fs = require("fs");
const { formatWithOptions } = require("util");
$(document).ready(function () {
    // console.log("Jquery loaded on ui");
    let db;
    let lsc;
    $("#grid .cell").on("click", function () {
        let rowId = Number($(this).attr("rowId")) + 1;
        let colId = Number($(this).attr("colId")) + 65;
        let address = String.fromCharCode(colId) + rowId;
        // input => value attribute
        $("#address-input").val(address);
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
                    bColor: "white"

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
        db[rowId][colId].value = $(this).html();
    })
    $("#formula-input").on("blur", function () {
        // to get data from input use val
        let formula = $(this).val();
        console.log(formula);
        let ans = evaluate(formula);
        alert(ans);
        let address = $("#address-input").val();
        let { rowId, colId } = getRCfromAddress(address);
        // console.log(rowId + " " + colId);
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
    }
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