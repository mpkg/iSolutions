using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using System.Xml;

namespace QuickAddressWCF
{
    [ServiceContract]
    public interface IQuickAddressSErvice
    {
        [OperationContract, XmlSerializerFormat]
        [WebGet(UriTemplate = "/Get/{query}/{key}/{maxnum}/{privat}/{firma}", ResponseFormat=WebMessageFormat.Xml ) ]
        XmlDocument GetData(string query, string key, string maxnum, string privat, string firma);       
    }
    
}
