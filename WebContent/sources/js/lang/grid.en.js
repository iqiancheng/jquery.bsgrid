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
        isFirstPage: 'This is first page!',
        isLastPage: 'This is last page!',
        needInteger: 'Please input number!',
        needRange: function (start, end) {
            return 'Please input a number between ' + start + ' and ' + end + '!';
        },
        errorForRequestData: 'Request datas fail!',
        errorForSendOrRequestData: 'Send or request datas fail!',
        noPagingation: function (noPagingationId) {
            return 'Count:&nbsp;<span id="' + noPagingationId + '"></span>';
        },
        pagingToolbar: {
            pageSizeDisplay: function (pageSizeId) {
                return 'PageSize:&nbsp;<select id="' + pageSizeId + '"></select>';
            },
            currentDisplayRows: function (startRowId, endRowId) {
                return 'Display:&nbsp;<span id="' + startRowId + '"></span>&nbsp;-&nbsp;<span id="' + endRowId + '"></span>';
            },
            totalRows: function (totalRowsId) {
                return 'Count:&nbsp;<span id="' + totalRowsId + '"></span>';
            },
            currentDisplayPageAndTotalPages: function (curPageId, totalPagesId) {
                return '<div><span id="' + curPageId + '"></span>&nbsp;/&nbsp;<span id="' + totalPagesId + '"></span></div>';
            },
            firstPage: 'First',
            prevPage: 'Prev',
            nextPage: 'Next',
            lastPage: 'Last',
            gotoPage: 'Goto'
        },
        loadingDataMessage: 'Loading data, Please wait......',
        noDataToDisplay: 'No data to display.'
    };

})(jQuery);