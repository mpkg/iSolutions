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
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "Service1" in code, svc and config file together.
    public class QuickAddressService : IQuickAddressSErvice
    {
        public XmlDocument GetData(string query, string key, string maxnum, string privat, string firma)
        {
            string serviceURL = @"http://tel.search.ch/api/?";
            string parametersString = "q=" + query + "&key=" + key;

            if (!string.IsNullOrEmpty(maxnum))
            {
                parametersString += "&maxnum=" + maxnum;
            }
            if (!string.IsNullOrEmpty(privat))
            {
                parametersString += "&privat=" + privat;
            }
            if (!string.IsNullOrEmpty(firma))
            {
                parametersString += "&firma=" + firma;
            }

            string requestURL = serviceURL + parametersString;
            string dwml = string.Empty;

            System.Net.WebClient webClient = new System.Net.WebClient();
            dwml = webClient.DownloadString(requestURL);

            XmlDocument xml = new XmlDocument();
            xml.LoadXml(dwml);

            return xml;
        }        
    }
}
