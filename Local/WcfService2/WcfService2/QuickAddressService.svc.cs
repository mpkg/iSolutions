using System.Xml;

namespace QuickAddressWCF
{
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

            byte[] abc = webClient.DownloadData(requestURL);
            dwml = System.Text.Encoding.UTF8.GetString(abc);

            XmlDocument xml = new XmlDocument();
            xml.LoadXml(dwml);

            return xml;
        }
    }
}