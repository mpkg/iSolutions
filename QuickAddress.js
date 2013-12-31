// JScript source code
var MIN_LENGTH = 4;

var API_KEY;
var API_URL = 'http://tel.search.ch/api/';
var PAUSE = 1000;
var parameterMaxnum = 3;
var parameterPrivat = 1;
var parameterFirma = 1;

var XrmObject = window.parent.Xrm;

//        set PRIVAT, FIRMA as per current entity
var entityName = XrmObject.Page.data.entity.getEntityName();
if (entityName == 'account') {
    parameterPrivat = 0;
}
else if (entityName == 'contact') {
    parameterFirma = 0;
}

$.support.cors = true; // Required - Enable cross domain requests;

$(document).ready(function () {
    getDataParam();
    $("#searchBox").autocomplete({
        minLength: MIN_LENGTH,
        delay: PAUSE,
        source: function (request, response) {
            var sourceData;
            //Suggestions only after 4 letters in text field                    
            $.ajax({
                async: false,
                url: API_URL,
                data: {
                    key: API_KEY,
                    q: request.term,
                    maxnum: parameterMaxnum,    // Limit suggestions to 3
                    privat: parameterPrivat,
                    firma: parameterFirma
                },
                success: function (data, textStatus, xmlHttpRequest) {
                    feed = data.getElementsByTagName('feed');
                    sourceData = $("entry", feed).map(function () {
                        return {
                            label: getEntryLabel('tel:name', this) +
                                    getEntryLabel('tel:street', this) +
                                    getEntryLabel('tel:streetno', this) +
                                    getEntryLabel('tel:city', this) +
                                    getEntryLabel('tel:zip', this),

                            value: getEntryValue('tel:firstname', this) + ', ' +
                                    getEntryValue('tel:name', this) + ', ' +
                                    getEntryValue('tel:streetno', this) + ', ' +
                                    getEntryValue('tel:street', this) + ', ' +
                                    getEntryValue('tel:city', this) + ', ' +
                                    getEntryValue('tel:zip', this) + ', ' +
                                    getEntryValue('tel:canton', this) + ', ' +
                                    getEntryValue('tel:phone', this) + ', ' +
                                    getEntryValue('tel:extra', this, 'fax') + ', ' +
                                    getEntryValue('tel:extra', this, 'email') + ', ' +
                                    getEntryValue('tel:extra', this, 'website')
                        };
                    }).get();
                    response(sourceData);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert(errorThrown);
                }
            });
        },
        select: function (event, ui) {
            var addressinfo = ui.item.value.split(",");
            setCRMFormFields(addressinfo);
        }
    });
});

function getEntryLabel(fieldName, xml) {
    var node = xml.getElementsByTagName(fieldName);
    if (node.length > 0) {
        return node[0].textContent + ',';
    }
    else {
        return;
    }
}

function getEntryValue(fieldName, xml, type) {
    var node = xml.getElementsByTagName(fieldName);
    if (node.length > 0) {

        //for extra nodes
        if (type && node[0].attributes.length > 0) {
            if (type == node[0].attributes[0].nodeValue) {
                return node[0].textContent;
            }
            else {
                return '';
            }
        }
        //for all other nodes
        else {
            return node[0].textContent;
        }
    }
    else {
        return '';
    }
}

function setCRMFormFields(addressInfo) {
    if (XrmObject.Page.getAttribute('name') && addressInfo[1] != ' ') XrmObject.Page.getAttribute('name').setValue(addressInfo[1]); //account name            
    if (XrmObject.Page.getAttribute('address1_line1') && addressInfo[2] != ' ') XrmObject.Page.getAttribute('address1_line1').setValue(addressInfo[2]);
    if (XrmObject.Page.getAttribute('address1_line2') && addressInfo[3] != ' ') XrmObject.Page.getAttribute('address1_line2').setValue(addressInfo[3]);
    //if (XrmObject.Page.getAttribute('address1_line3')) XrmObject.Page.getAttribute('address1_line3').setValue(addressInfo.line3);
    if (XrmObject.Page.getAttribute('address1_city') && addressInfo[4] != ' ') XrmObject.Page.getAttribute('address1_city').setValue(addressInfo[4]);
    if (XrmObject.Page.getAttribute('address1_stateorprovince') && addressInfo[6] != ' ') XrmObject.Page.getAttribute('address1_stateorprovince').setValue(addressInfo[6]);
    if (XrmObject.Page.getAttribute('address1_country')) XrmObject.Page.getAttribute('address1_country').setValue('Switzerland');
    if (XrmObject.Page.getAttribute('address1_postalcode') && addressInfo[5] != ' ') XrmObject.Page.getAttribute('address1_postalcode').setValue(addressInfo[5]);
    if (XrmObject.Page.getAttribute('address1_telephone1') && addressInfo[7] != ' ') XrmObject.Page.getAttribute('address1_telephone1').setValue(addressInfo[7]);
    if (XrmObject.Page.getAttribute('fax') && addressInfo[8] != ' ') XrmObject.Page.getAttribute('fax').setValue(addressInfo[8]);
    if (XrmObject.Page.getAttribute('emailaddress1') && addressInfo[9] != ' ') XrmObject.Page.getAttribute('emailaddress1').setValue(addressInfo[9]);
    if (XrmObject.Page.getAttribute('websiteurl') && addressInfo[10] != ' ') XrmObject.Page.getAttribute('websiteurl').setValue(addressInfo[10]); //account website
}

function getDataParam() {
    //Get the any query string parameters and load them
    //into the vals array

    var vals = new Array();
    if (location.search != "") {
        vals = location.search.substr(1).split("&");
        for (var i in vals) {
            vals[i] = vals[i].replace(/\+/g, " ").split("=");
        }
        //look for the parameter named 'data'
        var found = false;
        for (var i in vals) {
            if (vals[i][0].toLowerCase() == "data") {
                parseDataValue(vals[i][1]);
                found = true;
                break;
            }
        }
        if (!found)
        { noParams(); }
    }
    else {
        noParams();
    }
}

function parseDataValue(datavalue) {
    if (datavalue != "") {
        var vals = new Array();

        vals = decodeURIComponent(datavalue).split("&");
        for (var i in vals) {
            vals[i] = vals[i].replace(/\+/g, " ").split("=");
        }
        API_KEY = vals[0][0];
    }
    else {
        noParams();
    }
}

function noParams() {
    alert('Quick Addess: API Key not provided');
}
