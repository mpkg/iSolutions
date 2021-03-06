// JScript source code
//Constants & Variables
{
    var MIN_LENGTH = 4;
    var API_URL = 'https://quickaddress.cloudapp.net/QuickAddressService.svc/Get'; //'https://moduleasycreatech.isolutions.ch/QuickAddressService.svc/Get';
    var PAUSE = 1000;
    var parameterMaxnum = 3;
    var parameterPrivat = 1;
    var parameterFirma = 1;
    var API_KEY;
    var addressinfo;
}

//Xrm reference
var XrmObject = window.parent.Xrm;

//set PRIVAT, FIRMA as per current entity
{
    var entityName = XrmObject.Page.data.entity.getEntityName();
    if (entityName == 'account') {
        parameterPrivat = 0;
    }
    else if (entityName == 'contact') {
        parameterFirma = 0;
    }
}

//get API KEY from query string parameter
{
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
}

$(document).ready(function () {
    getDataParam();
    jQuery.support.cors = true;
    //define jquery auto complete function
    $("#searchfield")
    .autocomplete({
        minLength: MIN_LENGTH, // minimum characters required to make an API call
        delay: PAUSE, //pause before making a request to tel.search api
        source: function (request, response) {
            var sourceData;

            $.ajax({
                type: 'GET',
                url: API_URL + '/' + request.term + '/' + API_KEY + '/' + parameterMaxnum + '/' + parameterPrivat + '/' + parameterFirma,
                contentType: 'application/xml; charset=utf-8',
                dataType: "xml",
                success: function (data, textStatus, xmlHttpRequest) {
                    feed = data.getElementsByTagName('feed');
                    sourceData = $("entry", feed).map(function () {
                        return {
                            label: getEntryLabel('tel:firstname', this) +
                                                getEntryLabel('tel:name', this) +
                                                getEntryLabel('tel:street', this) +
                                                getEntryLabel('tel:streetno', this) +
                                                getEntryLabel('tel:zip', this) +
                                                getEntryLabel('tel:city', this),

                            value: getEntryValue('tel:firstname', this) +
                                                getEntryValue('tel:name', this) +
                                                getEntryValue('tel:streetno', this) +
                                                getEntryValue('tel:street', this) +
                                                getEntryValue('tel:city', this) +
                                                getEntryValue('tel:zip', this) +
                                                getEntryValue('tel:canton', this) +
                                                getEntryValue('tel:phone', this) +
                                                getEntryValue('tel:extra', this, 'fax') +
                                                getEntryValue('tel:extra', this, 'email') +
                                                getEntryValue('tel:extra', this, 'website') +
                                                getEntryValue('tel:type', this)
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
            addressinfo = ui.item.value.split("|");
            setCRMFormFields(addressinfo);
        }
    })
});

function getEntryLabel(fieldName, xml) {
    var node = xml.getElementsByTagName(fieldName);
    if (node.length > 0) {
        if (fieldName == 'tel:firstname' || fieldName == 'tel:street' || fieldName == 'tel:zip') {
            return (node[0].text || node[0].textContent) + ' ';
        }
        else if (fieldName == 'tel:city') {
            return node[0].text || node[0].textContent;
        }
        else {
            return (node[0].text || node[0].textContent) + ', ';
        }
    }
    else {
        return '';
    }
}

function getEntryValue(fieldName, xml, type) {
    var node = xml.getElementsByTagName(fieldName);
    if (node.length > 0) {

        //for extra nodes
        if (type) {
            for (var i = 0; i < node.length; i++) {
                if (node[i].attributes.length > 0) {
                    if (type == node[i].attributes[0].nodeValue.toLowerCase()) {
                        return (node[i].text || node[i].textContent) + '|';
                    }
                }
            }
            return '|';
        }
        //for all other nodes
        else {
            return (node[0].text || node[0].textContent) + '|';
        }
    }
    else {
        return '|';
    }
}

function setCRMFormFields(addressInfo) {    
    if (addressInfo[11].toLowerCase() == 'person') {
        if (XrmObject.Page.getAttribute('firstname')) XrmObject.Page.getAttribute('firstname').setValue(addressInfo[0]);
        if (XrmObject.Page.getAttribute('lastname')) XrmObject.Page.getAttribute('lastname').setValue(addressInfo[1]);
    }
    else if (addressInfo[11].toLowerCase() == 'organisation') {
        if (XrmObject.Page.getAttribute('name')) XrmObject.Page.getAttribute('name').setValue(addressInfo[1]);
        if (XrmObject.Page.getAttribute('companyname')) XrmObject.Page.getAttribute('companyname').setValue(addressInfo[1]);
    }
    if (XrmObject.Page.getAttribute('address1_line1')) XrmObject.Page.getAttribute('address1_line1').setValue(addressInfo[3] + ' ' + addressInfo[2]);
    if (XrmObject.Page.getAttribute('address1_city')) XrmObject.Page.getAttribute('address1_city').setValue(addressInfo[4]);
    if (XrmObject.Page.getAttribute('address1_stateorprovince')) XrmObject.Page.getAttribute('address1_stateorprovince').setValue(addressInfo[6]);
    if (XrmObject.Page.getAttribute('address1_country')) XrmObject.Page.getAttribute('address1_country').setValue('Switzerland');
    if (XrmObject.Page.getAttribute('address1_postalcode')) XrmObject.Page.getAttribute('address1_postalcode').setValue(addressInfo[5]);
    if (XrmObject.Page.getAttribute('address1_telephone1')) XrmObject.Page.getAttribute('address1_telephone1').setValue(addressInfo[7]);
    if (XrmObject.Page.getAttribute('telephone1')) XrmObject.Page.getAttribute('telephone1').setValue(addressInfo[7]);
    if (XrmObject.Page.getAttribute('fax')) XrmObject.Page.getAttribute('fax').setValue(addressInfo[8]);
    if (XrmObject.Page.getAttribute('emailaddress1')) XrmObject.Page.getAttribute('emailaddress1').setValue(addressInfo[9]);
    if (XrmObject.Page.getAttribute('websiteurl')) XrmObject.Page.getAttribute('websiteurl').setValue(addressInfo[10]);
}

