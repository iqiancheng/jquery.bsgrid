/**
 * jQuery.bsgrid v1.21 by @Baishui2004
 * Copyright 2014 Apache v2 License
 * https://github.com/baishui2004/jquery.bsgrid
 */
/**
 * require common.js.
 *
 * @author Baishui2004
 * @Date August 31, 2014
 */
(function ($) {

    $.fn.bsgrid = {

        // defaults settings
        defaults: {
            url: '', // page request url
            dataType: 'json',
            autoLoad: true, // load onReady
            pageAll: false, // display all datas, no paging only count
            pageSize: 20, // page size. if set value little then 1, then pageAll will auto set true
            pageSizeSelect: false, // if display pageSize select option
            pageSizeForGrid: [5, 10, 20, 25, 50, 100, 200, 500], // pageSize select option
            displayBlankRows: true,
            stripeRows: false, // stripe rows
            pagingToolbarAlign: 'right',
            pagingBtnClass: 'pagingBtn', // paging toolbar button css class
            displayPagingToolbarOnlyMultiPages: false,
            isProcessLockScreen: true,
            // longLengthAotoSubAndTip: if column's value length longer than it, auto sub and tip it.
            //    sub: txt.substring(0, MaxLength-3) + '...'. if column's render is not false, then this property is not make effective to it.
            longLengthAotoSubAndTip: true,
            colsProperties: {
                // body row every column config
                align: 'center',
                maxLength: 40, // every column's value display max length
                // config properties's name
                indexAttr: 'w_index',
                sortAttr: 'w_sort', // use: w_sort="id" or w_sort="id,desc" or w_sort="id,asc"
                alignAttr: 'w_align',
                lengthAttr: 'w_length', // per column's value display max length, default maxLength
                renderAttr: 'w_render', // use: w_render="funMethod"
                hiddenAttr: 'w_hidden',
                tipAttr: 'w_tip'
            },
            // request params name
            requestParamsName: {
                pageSize: 'pageSize',
                curPage: 'curPage',
                sortName: 'sortName',
                sortOrder: 'sortOrder'
            },
            // before page ajax request send
            beforeSend: function (options, XMLHttpRequest) {
            },
            // after page ajax request complete
            complete: function (options, XMLHttpRequest, textStatus) {
            },
            /**
             * additional before render grid.
             *
             * @param parseSuccess if ajax data parse success, true or false
             * @param gridData page ajax return data
             * @param options
             */
            additionalBeforeRenderGrid: function (parseSuccess, gridData, options) {
            },
            /**
             * additional render per row, no matter blank row or not blank row.
             *
             * @param record row record, may be null
             * @param rowIndex row index, from 0
             * @param options
             */
            additionalRenderPerRow: function (record, rowIndex, options) {
            },
            /**
             * additional after render grid.
             *
             * @param parseSuccess if ajax data parse success, true or false
             * @param gridData page ajax return data
             * @param options
             */
            additionalAfterRenderGrid: function (parseSuccess, gridData, options) {
            }
        },

        gridObjs: {
        },

        init: function (gridId, settings) {
            var options = {
                settings: $.extend(true, {}, $.fn.bsgrid.defaults, settings),
                gridId: gridId,
                noPagingationId: gridId + '_no_pagination',
                pagingOutTabId: gridId + '_pt_outTab',
                pagingId: gridId + '_pt',
                // sort
                sortName: '',
                sortOrder: '',
                // other parameters, values: false, A Object or A jquery serialize Array
                otherParames: false,
                totalRows: 0,
                totalPages: 0,
                curPage: 1,
                curPageRowsNum: 0,
                startRow: 0,
                endRow: 0
            };

            options.settings.dataType = options.settings.dataType.toLowerCase();
            if (options.settings.pageSizeSelect) {
                if ($.inArray(options.settings.pageSize, options.settings.pageSizeForGrid) == -1) {
                    options.settings.pageSizeForGrid.push(options.settings.pageSize);
                }
                options.settings.pageSizeForGrid.sort(function (a, b) {
                    return a - b;
                });
            }

            var gridObj = {
                options: options,
                getPageCondition: function (curPage) {
                    return $.fn.bsgrid.getPageCondition(curPage, options);
                },
                page: function (curPage) {
                    $.fn.bsgrid.page(curPage, options);
                },
                getRecord: function (row) {
                    return $.fn.bsgrid.getRecord(row, options);
                },
                getRecordIndexValue: function (record, index) {
                    return $.fn.bsgrid.getRecordIndexValue(record, index, options);
                },
                getColumnValue: function (row, index) {
                    return $.fn.bsgrid.getColumnValue(row, index, options);
                },
                sort: function (obj) {
                    $.fn.bsgrid.sort(obj, options);
                },
                getGridHeaderObject: function () {
                    return $.fn.bsgrid.getGridHeaderObject(options);
                },
                appendHeaderSort: function () {
                    $.fn.bsgrid.appendHeaderSort(options);
                },
                setGridBlankBody: function () {
                    $.fn.bsgrid.setGridBlankBody(options);
                },
                createPagingOutTab: function () {
                    $.fn.bsgrid.createPagingOutTab(options);
                },
                clearGridBodyData: function () {
                    $.fn.bsgrid.clearGridBodyData(options);
                },
                getCurPage: function () {
                    return $.fn.bsgrid.getCurPage(options);
                },
                refreshPage: function () {
                    $.fn.bsgrid.refreshPage(options);
                },
                firstPage: function () {
                    $.fn.bsgrid.firstPage(options);
                },
                prevPage: function () {
                    $.fn.bsgrid.prevPage(options);
                },
                nextPage: function () {
                    $.fn.bsgrid.nextPage(options);
                },
                lastPage: function () {
                    $.fn.bsgrid.lastPage(options);
                },
                gotoPage: function (goPage) {
                    $.fn.bsgrid.gotoPage(options, goPage);
                },
                initPaging: function () {
                    return $.fn.bsgrid.initPaging(options);
                },
                setPagingValues: function () {
                    $.fn.bsgrid.setPagingValues(options);
                }
            };

            // store mapping grid id to gridObj
            $.fn.bsgrid.gridObjs[gridId] = gridObj;

            // if no pagination
            if (options.settings.pageAll || options.settings.pageSize < 1) {
                options.settings.pageAll = true;
                options.settings.pageSize = 0;
            }

            gridObj.appendHeaderSort();

            // init paging
            gridObj.createPagingOutTab();

            if (!options.settings.pageAll) {
                gridObj.pagingObj = gridObj.initPaging();
            }

            if (options.settings.isProcessLockScreen) {
                $.fn.bsgrid.addLockScreen(options);
            }

            // auto load
            if (options.settings.autoLoad) {
                // delay 10 millisecond for return gridObj first, then page
                setTimeout(function () {
                    gridObj.page(1);
                }, 10);
            }

            return gridObj;
        },

        getGridObj: function (gridId) {
            var obj = $.fn.bsgrid.gridObjs[gridId];
            return obj ? obj : null;
        },

        parseData: {
            success: function (type, gridData) {
                if (type == 'json') {
                    return $.fn.bsgrid.parseJsonData.success(gridData);
                } else if (type == 'xml') {
                    return $.fn.bsgrid.parseXmlData.success(gridData);
                }
                return false;
            },
            totalRows: function (type, gridData) {
                if (type == 'json') {
                    return $.fn.bsgrid.parseJsonData.totalRows(gridData);
                } else if (type == 'xml') {
                    return $.fn.bsgrid.parseXmlData.totalRows(gridData);
                }
                return false;
            },
            curPage: function (type, gridData) {
                if (type == 'json') {
                    return $.fn.bsgrid.parseJsonData.curPage(gridData);
                } else if (type == 'xml') {
                    return $.fn.bsgrid.parseXmlData.curPage(gridData);
                }
                return false;
            },
            data: function (type, gridData) {
                if (type == 'json') {
                    return $.fn.bsgrid.parseJsonData.data(gridData);
                } else if (type == 'xml') {
                    return $.fn.bsgrid.parseXmlData.data(gridData);
                }
                return false;
            },
            getRecord: function (type, data, row) {
                if (type == 'json') {
                    return $.fn.bsgrid.parseJsonData.getRecord(data, row);
                } else if (type == 'xml') {
                    return $.fn.bsgrid.parseXmlData.getRecord(data, row);
                }
                return false;
            },
            getColumnValue: function (type, record, index) {
                if (type == 'json') {
                    return $.fn.bsgrid.parseJsonData.getColumnValue(record, index);
                } else if (type == 'xml') {
                    return $.fn.bsgrid.parseXmlData.getColumnValue(record, index);
                }
                return false;
            }
        },

        parseJsonData: {
            success: function (json) {
                return json.success;
            },
            totalRows: function (json) {
                return json.totalRows;
            },
            curPage: function (json) {
                return json.curPage;
            },
            data: function (json) {
                return json.data;
            },
            getRecord: function (data, row) {
                return data[row];
            },
            getColumnValue: function (record, index) {
                return $.trim(record[index]);
            }
        },

        parseXmlData: {
            success: function (xml) {
                return $.trim($(xml).find('gridData success').text()) == 'true';
            },
            totalRows: function (xml) {
                return parseInt($(xml).find('gridData totalRows').text());
            },
            curPage: function (xml) {
                return parseInt($(xml).find('gridData curPage').text());
            },
            data: function (xml) {
                return $(xml).find('gridData data row');
            },
            getRecord: function (data, row) {
                return data.eq(row);
            },
            getColumnValue: function (record, index) {
                return $.trim(record.find(index).text());
            }
        },

        getPageCondition: function (curPage, options) {
            // other parames
            var params = new StringBuilder();
            if (options.otherParames == false) {
                // do nothing
            } else if (options.otherParames instanceof Array) {
                $.each(options.otherParames, function (i, objVal) {
                    params.append('&' + objVal.name + '=' + objVal.value);
                });
            } else {
                for (var key in options.otherParames) {
                    params.append('&' + key + '=' + options.otherParames[key]);
                }
            }

            var condition = params.length == 0 ? '' : params.toString().substring(1);
            condition += (condition.length == 0 ? '' : '&')
                + options.settings.requestParamsName.pageSize + '=' + options.settings.pageSize
                + '&' + options.settings.requestParamsName.curPage + '=' + curPage
                + '&' + options.settings.requestParamsName.sortName + '=' + options.sortName
                + '&' + options.settings.requestParamsName.sortOrder + '=' + options.sortOrder;
            return condition;
        },

        page: function (curPage, options) {
            if ($.trim(curPage) == '' || isNaN(curPage)) {
                alert($.bsgridLanguage.needInteger);
                return;
            }
            var dataType = options.settings.dataType;
            $.ajax({
                type: 'post',
                url: options.settings.url,
                data: $.fn.bsgrid.getPageCondition(curPage, options),
                dataType: dataType,
                beforeSend: function (XMLHttpRequest) {
                    if (options.settings.isProcessLockScreen) {
                        $.fn.bsgrid.lockScreen(options);
                    }
                    options.settings.beforeSend(options, XMLHttpRequest);
                },
                complete: function (XMLHttpRequest, textStatus) {
                    options.settings.complete(options, XMLHttpRequest, textStatus);
                    if (options.settings.isProcessLockScreen) {
                        $.fn.bsgrid.unlockScreen(options);
                    }
                },
                success: function (gridData, textStatus) {
                    var parseSuccess = $.fn.bsgrid.parseData.success(dataType, gridData);
                    options.settings.additionalBeforeRenderGrid(parseSuccess, gridData, options);
                    if (parseSuccess) {
                        var totalRows = parseInt($.fn.bsgrid.parseData.totalRows(dataType, gridData));
                        curPage = parseInt($.fn.bsgrid.parseData.curPage(dataType, gridData));

                        if (options.settings.pageAll) {
                            // display all datas, no paging
                            curPage = 1;
                            options.settings.pageSize = totalRows;
                            $('#' + options.noPagingationId).html(totalRows);
                        }

                        var pageSize = options.settings.pageSize;
                        var curPageRowsNum = (curPage * pageSize < totalRows) ? pageSize : (totalRows - (curPage - 1) * pageSize);
                        var totalPages = parseInt(totalRows / pageSize);
                        totalPages = parseInt((totalRows % pageSize == 0) ? totalPages : totalPages + 1);
                        var startRow = (curPage - 1) * pageSize + 1;
                        var endRow = (curPage - 1) * pageSize + curPageRowsNum;
                        startRow = curPageRowsNum <= 0 ? 0 : startRow;
                        endRow = curPageRowsNum <= 0 ? 0 : endRow;

                        // set options pagination values
                        options.totalRows = totalRows;
                        options.totalPages = totalPages;
                        options.curPage = curPage;
                        options.curPageRowsNum = curPageRowsNum;
                        options.startRow = startRow;
                        options.endRow = endRow;

                        if (!options.settings.pageAll) {
                            $.fn.bsgrid.setPagingValues(options);
                        }

                        if (options.settings.displayPagingToolbarOnlyMultiPages && totalPages <= 1) {
                            $('#' + options.pagingId).hide();
                            $('#' + options.pagingOutTabId).hide();
                        } else {
                            $('#' + options.pagingOutTabId).show();
                            $('#' + options.pagingId).show();
                        }

                        $.fn.bsgrid.setGridBlankBody(options);
                        if (curPageRowsNum == 0) {
                            return;
                        }

                        var headerTh = $.fn.bsgrid.getGridHeaderObject(options);
                        var data = $.fn.bsgrid.parseData.data(dataType, gridData);
                        var dataLen = data.length;
                        $('#' + options.gridId + ' tr:not(:first)').each(
                            function (i) {
                                var record = null;
                                if (i < curPageRowsNum) {
                                    // support parse return all datas or only return current page datas
                                    record = $.fn.bsgrid.parseData.getRecord(dataType, data, dataLen != totalRows ? i : startRow + i - 1);
                                }
                                $.fn.bsgrid.storeRowData(i, record, options);
                                $(this).find('td').each(function (j) {
                                    // column index
                                    var index = $.trim(headerTh.eq(j).attr(options.settings.colsProperties.indexAttr));
                                    // column render
                                    var render = $.trim(headerTh.eq(j).attr(options.settings.colsProperties.renderAttr));
                                    // column tip
                                    var tip = $.trim(headerTh.eq(j).attr(options.settings.colsProperties.tipAttr));
                                    // column text max length
                                    var maxLen = $.trim(headerTh.eq(j).attr(options.settings.colsProperties.lengthAttr));
                                    maxLen = maxLen.length != 0 ? parseInt(maxLen) : options.settings.colsProperties.maxLength;
                                    if (i < curPageRowsNum) {
                                        if (render != '') {
                                            var render_method = eval(render);
                                            var render_html = render_method(record, i, j, options);
                                            $(this).html(render_html);
                                        } else if (index != '') {
                                            {
                                                var value = $.fn.bsgrid.parseData.getColumnValue(dataType, record, index);
                                                if (tip == 'true') {
                                                    $.fn.bsgrid.columnTip(this, value);
                                                }
                                                if (options.settings.longLengthAotoSubAndTip) {
                                                    $.fn.bsgrid.longLengthSubAndTip(this, value, maxLen);
                                                } else {
                                                    $(this).html(value);
                                                }
                                            }
                                        }
                                    } else {
                                        $(this).html('&nbsp;');
                                    }
                                });
                                options.settings.additionalRenderPerRow(record, i, options);
                            }
                        );
                    } else {
                        alert($.bsgridLanguage.errorForRequestData);
                    }
                    options.settings.additionalAfterRenderGrid(parseSuccess, gridData, options);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert($.bsgridLanguage.errorForSendOrRequestData);
                }
            });
        },

        storeRowData: function (row, record, options) {
            $('#' + options.gridId + ' tr:eq(' + (row + 1) + ')').data('record', record);
        },

        getRecord: function (row, options) {
            var record = $('#' + options.gridId + ' tr:eq(' + (row + 1) + ')').data('record');
            return record == undefined ? null : record;
        },

        getRecordIndexValue: function (record, index, options) {
            if (record == null) {
                return '';
            } else {
                return $.fn.bsgrid.parseData.getColumnValue(options.settings.dataType, record, index);
            }
        },

        getColumnValue: function (row, index, options) {
            var record = $.fn.bsgrid.getRecord(row, options);
            return $.fn.bsgrid.getRecordIndexValue(record, index, options);
        },

        sort: function (obj, options) {
            var field = $(obj).attr('sortName');
            // revert style
            $.fn.bsgrid.getGridHeaderObject(options).each(function () {
                if ($.trim($(this).attr(options.settings.colsProperties.sortAttr)).length != 0) {
                    $(this).find('a').attr('class', 'sort sort-view');
                }
            });
            if (options.sortName == field) {
                if (options.sortOrder == 'asc') {
                    options.sortOrder = 'desc';
                    $(obj).attr('class', 'sort sort-desc');
                } else {
                    options.sortOrder = 'asc';
                    $(obj).attr('class', 'sort sort-asc');
                }
            } else {
                options.sortName = field;
                options.sortOrder = 'desc';
                $(obj).attr('class', 'sort sort-desc');
            }
            $.fn.bsgrid.refreshPage(options);
        },

        getGridHeaderObject: function (options) {
            return $('#' + options.gridId + ' tr').first().find('th');
        },

        appendHeaderSort: function (options) {
            // grid header
            $.fn.bsgrid.getGridHeaderObject(options).each(function () {
                // sort
                var sortAttr = options.settings.colsProperties.sortAttr;
                var sortInfo = $.trim($(this).attr(sortAttr));
                if (sortInfo.length != 0) {
                    var sortInfoArray = sortInfo.split(',');
                    var sortName = sortInfoArray[0];
                    // default sort and direction
                    var sortOrder = sortInfoArray.length > 1 ? sortInfoArray[1] : '';
                    var sortHtml = '<a href="#" sortName="' + sortName + '" class="sort ';
                    if (sortOrder != '' && (sortOrder == 'desc' || sortOrder == 'asc')) {
                        options.sortName = sortName;
                        options.sortOrder = sortOrder;
                        sortHtml += 'sort-' + sortOrder;
                    } else {
                        sortHtml += 'sort-view';
                    }
                    sortHtml += '">&nbsp;&nbsp;&nbsp;</a>'; // use: "&nbsp;&nbsp;&nbsp;", different from: "&emsp;" is: IE8 and IE9 not display "&emsp;"
                    $(this).append(sortHtml);
                }
            });

            $('#' + options.gridId + ' th .sort').each(function () {
                $(this).click(function () {
                    $.fn.bsgrid.sort(this, options);
                });
            });
        },

        setGridBlankBody: function (options) {
            // remove rows
            $('#' + options.gridId + ' tr:not(:first)').remove();

            var header = $.fn.bsgrid.getGridHeaderObject(options);
            // add rows
            var rowSb = '';
            if (options.settings.pageSize > 0) {
                var alignAttr = options.settings.colsProperties.alignAttr;
                var hiddenAttr = options.settings.colsProperties.hiddenAttr;

                var trSb = new StringBuilder();
                trSb.append('<tr>');
                for (var hi = 0; hi < header.length; hi++) {
                    trSb.append('<td');
                    var align = $.trim(header.eq(hi).attr(alignAttr));
                    align = align == '' ? options.settings.colsProperties.align : align;
                    trSb.append(' style="text-align: ' + align + ';');
                    var hidden = $.trim(header.eq(hi).attr(hiddenAttr));
                    if (hidden == 'true') {
                        header.eq(hi).css('display', 'none');
                        trSb.append(' display: none;');
                    }
                    trSb.append('"');
                    trSb.append('></td>');
                }
                trSb.append('</tr>');
                rowSb = trSb.toString();
            }
            var rowsSb = new StringBuilder();
            var curPageRowsNum = options.settings.pageSize;
            if (!options.settings.displayBlankRows) {
                curPageRowsNum = options.endRow - options.startRow + 1;
                curPageRowsNum = options.endRow > 0 ? curPageRowsNum : 0;
            }
            if (curPageRowsNum == 0) {
                rowsSb.append('<tr><td colspan="' + header.length + '">' + $.bsgridLanguage.noDataToDisplay + '</td></tr>');
            } else {
                for (var pi = 0; pi < curPageRowsNum; pi++) {
                    rowsSb.append(rowSb);
                }
            }
            $('#' + options.gridId).append(rowsSb.toString());

            if (curPageRowsNum != 0) {
                if (options.settings.stripeRows) {
                    $('#' + options.gridId + ' tr:even').addClass('even_index_row');
                }
            }
        },

        createPagingOutTab: function (options) {
            var pagingOutTabSb = new StringBuilder();
            pagingOutTabSb.append('<table id="' + options.pagingOutTabId + '" class="bsgridPagingOutTab" style="display: none;"><tr><td align="' + options.settings.pagingToolbarAlign + '">');
            // display all datas, no paging
            if (options.settings.pageAll) {
                pagingOutTabSb.append($.bsgridLanguage.noPagingation(options.noPagingationId) + '&nbsp;&nbsp;&nbsp;');
            }
            pagingOutTabSb.append('</td></tr></table>');
            $('#' + options.gridId).after(pagingOutTabSb.toString());
        },

        clearGridBodyData: function (options) {
            $('#' + options.gridId + ' tr:not(:first)').each(
                function () {
                    $(this).find('td').each(function () {
                        $(this).html('&nbsp;');
                    });
                }
            );
        },

        /**
         * add lock screen.
         *
         * @param options
         */
        addLockScreen: function (options) {
            if ($('.bsgrid.lockscreen').length == 0) {
                var lockScreenHtml = new StringBuilder();
                lockScreenHtml.append('<div class="bsgrid lockscreen" times="0">');
                lockScreenHtml.append('</div>');
                lockScreenHtml.append('<div class="bsgrid loading_div">');
                lockScreenHtml.append('<table><tr><td><center><div class="bsgrid loading"><span>&nbsp;&emsp;</span>&nbsp;' + $.bsgridLanguage.loadingDataMessage + '&emsp;<center></div></td></tr></table>');
                lockScreenHtml.append('</div>');
                $('body').append(lockScreenHtml.toString());
            }
        },

        /**
         * open lock screen.
         *
         * @param options
         */
        lockScreen: function (options) {
            $('.bsgrid.lockscreen').attr('times', parseInt($('.bsgrid.lockscreen').attr('times')) + 1);
            if ($('.bsgrid.lockscreen').css('display') == 'none') {
                $('.bsgrid.lockscreen').show();
                $('.bsgrid.loading_div').show();
            }
        },

        /**
         * close lock screen.
         *
         * @param options
         */
        unlockScreen: function (options) {
            $('.bsgrid.lockscreen').attr('times', parseInt($('.bsgrid.lockscreen').attr('times')) - 1);
            if ($('.bsgrid.lockscreen').attr('times') == '0') {
                // delay 0.1s, to make lock screen look better
                setTimeout(function () {
                    $('.bsgrid.lockscreen').hide();
                    $('.bsgrid.loading_div').hide();
                }, 100);
            }
        },

        /**
         * tip column.
         *
         * @param obj column td obj
         * @param value column's value
         */
        columnTip: function (obj, value) {
            $(obj).attr('title', value);
        },

        /**
         * if column's value length longer than it, auto sub and tip it.
         *    sub: txt.substring(0, MaxLength-3) + '...'.
         *
         * @param obj column td obj
         * @param value column's value
         * @param maxLen max length
         */
        longLengthSubAndTip: function (obj, value, maxLen) {
            if (value.length > maxLen) {
                $(obj).html(value.substring(0, maxLen - 3) + '...');
                $.fn.bsgrid.columnTip(obj, value);
            } else {
                $(obj).html(value);
            }
        },

        getCurPage: function (options) {
            return $.fn.bsgrid.getGridObj(options.gridId).pagingObj.getCurPage();
        },

        refreshPage: function (options) {
            $.fn.bsgrid.getGridObj(options.gridId).pagingObj.refreshPage();
        },

        firstPage: function (options) {
            $.fn.bsgrid.getGridObj(options.gridId).pagingObj.firstPage();
        },

        prevPage: function (options) {
            $.fn.bsgrid.getGridObj(options.gridId).pagingObj.prevPage();
        },

        nextPage: function (options) {
            $.fn.bsgrid.getGridObj(options.gridId).pagingObj.nextPage();
        },

        lastPage: function (options) {
            $.fn.bsgrid.getGridObj(options.gridId).pagingObj.lastPage();
        },

        gotoPage: function (options, goPage) {
            $.fn.bsgrid.getGridObj(options.gridId).pagingObj.gotoPage(goPage);
        },

        /**
         * init paging.
         *
         * @param options grid options
         */
        initPaging: function (options) {
            $('#' + options.pagingOutTabId + ' td').attr('id', options.pagingId);
            // config same properties's
            return $.fn.bsgrid_paging.init(options.pagingId, {
                gridId: options.gridId,
                pageSize: options.settings.pageSize,
                pageSizeSelect: options.settings.pageSizeSelect,
                pageSizeForGrid: options.settings.pageSizeForGrid,
                pagingBtnClass: options.settings.pagingBtnClass
            });
        },

        /**
         * Set paging values.
         *
         * @param options grid options
         */
        setPagingValues: function (options) {
            $.fn.bsgrid.getGridObj(options.gridId).pagingObj.setPagingValues(options.curPage, options.totalRows);
        }

    };

})(jQuery);