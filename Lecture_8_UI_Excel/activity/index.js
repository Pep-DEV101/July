const $ = require("jquery");
const dialog = require("electron").remote.dialog;
const fs = require("fs");
$(document).ready(function () {
    // console.log("Jquery loaded on ui");
    let db;
    $("#grid .cell").on("click", function () {
        let rowId = Number($(this).attr("rowId")) + 1;
        let colId = Number($(this).attr("colId")) + 65;
        let address = String.fromCharCode(colId) + rowId;
        // input => value attribute
        $("#address-input").val(address);
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
        $(cellNumberElem).height(height);
    })

    $(".menu").on("click", function () {
        let menuName = $(this).attr("id");

        $(".menu-options").removeClass("active");
        $("#" + menuName + "-menu-options").addClass("active");
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
                let cell = "";
                row.push(cell);
            }
            db.push(row);
        }
        // console.log(ts);
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

    $("#grid .cell").on("blur", function () {
        let { rowId, colId } = getRcfromElem(this);
        db[rowId][colId] = $(this).html();
    })
    function getRcfromElem(elem) {
        let rowId = $(elem).attr("rowId");
        let colId = $(elem).attr("colId");
        return {
            rowId,
            colId
        }
    }
    function init() {
$("#File").trigger("click");
$("#New").trigger("click");
    }
    init();
})