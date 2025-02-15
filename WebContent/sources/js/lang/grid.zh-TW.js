/**
 * jQuery.bsgrid v1.21 by @Baishui2004
 * Copyright 2014 Apache v2 License
 * https://github.com/baishui2004/jquery.bsgrid
 */
/**
 * @author Baishui2004
 * @Date August 31, 2014
 */
(function ($) {

    $.bsgridLanguage = {
        isFirstPage: '已經是第一頁！',
        isLastPage: '已經是最後一頁！',
        needInteger: '請輸入數字！',
        needRange: function (start, end) {
            return '請輸入一個在' + start + '到' + end + '之間的數字！';
        },
        errorForRequestData: '請求數據失敗！',
        errorForSendOrRequestData: '發送或請求數據失敗！',
        noPagingation: function (noPagingationId) {
            return '共:&nbsp;<span id="' + noPagingationId + '"></span>';
        },
        pagingToolbar: {
            pageSizeDisplay: function (pageSizeId) {
                return '每頁顯示:&nbsp;<select id="' + pageSizeId + '"></select>';
            },
            currentDisplayRows: function (startRowId, endRowId) {
                return '當前顯示:&nbsp;<span id="' + startRowId + '"></span>&nbsp;-&nbsp;<span id="' + endRowId + '"></span>';
            },
            totalRows: function (totalRowsId) {
                return '共:&nbsp;<span id="' + totalRowsId + '"></span>';
            },
            currentDisplayPageAndTotalPages: function (curPageId, totalPagesId) {
                return '<div><span id="' + curPageId + '"></span>&nbsp;/&nbsp;<span id="' + totalPagesId + '"></span></div>';
            },
            firstPage: '首&nbsp;頁',
            prevPage: '上一頁',
            nextPage: '下一頁',
            lastPage: '末&nbsp;頁',
            gotoPage: '跳&nbsp;轉'
        },
        loadingDataMessage: '正在加載數據，請稍候......',
        noDataToDisplay: '沒有數據可以用於顯示。'
    };

})(jQuery);