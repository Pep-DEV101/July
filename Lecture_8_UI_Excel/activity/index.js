const $ = require("jquery");
$(document).ready(function () {
    // console.log("Jquery loaded on ui");

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
     let menuName=$(this).attr("id");

    $(".menu-options").removeClass("active");
     $("#"+menuName+"-menu-options").addClass("active");
    })
})