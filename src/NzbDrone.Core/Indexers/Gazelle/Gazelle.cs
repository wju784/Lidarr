using NLog;
using NzbDrone.Common.Cache;
using NzbDrone.Common.Http;
using NzbDrone.Core.Configuration;
using NzbDrone.Core.Parser;
using NzbDrone.Core.ThingiProvider;
using System.Collections.Generic;

namespace NzbDrone.Core.Indexers.Gazelle
{
    public class Gazelle : HttpIndexerBase<GazelleSettings>
    {
        public override string Name => "Gazelle API";
        public override DownloadProtocol Protocol => DownloadProtocol.Torrent;
        public override bool SupportsRss => true;
        public override bool SupportsSearch => true;
        public override int PageSize => 50;

        private readonly ICached<Dictionary<string, string>> _authCookieCache;
        private readonly IHttpClient _httpClient;
        private readonly Logger _logger;

        public Gazelle(IHttpClient httpClient, ICacheManager cacheManager, IIndexerStatusService indexerStatusService,
            IConfigService configService, IParsingService parsingService, Logger logger)
            : base(httpClient, indexerStatusService, configService, parsingService, logger)
        {
            _httpClient = httpClient;
            _logger = logger;
            _authCookieCache = cacheManager.GetCache<Dictionary<string, string>>(GetType(), "authCookies");
        }

        public override IIndexerRequestGenerator GetRequestGenerator()
        {
            return new GazelleRequestGenerator()
            {
                Settings = Settings,
                HttpClient = _httpClient,
                Logger = _logger,
                AuthCookieCache = _authCookieCache
            };
        }

        public override IParseIndexerResponse GetParser()
        {
            return new GazelleParser(Settings);
        }

        public override IEnumerable<ProviderDefinition> DefaultDefinitions
        {
            get
            {
                yield return GetDefinition("Apollo.Rip", GetSettings("https://apollo.rip"));
                yield return GetDefinition("REDacted", GetSettings("https://redacted.ch"));
                yield return GetDefinition("Not What CD", GetSettings("https://notwhat.cd"));

            }
        }

        private IndexerDefinition GetDefinition(string name, GazelleSettings settings)
        {
            return new IndexerDefinition
            {
                EnableRss = false,
                EnableAutomaticSearch = false,
                EnableInteractiveSearch = false,
                Name = name,
                Implementation = GetType().Name,
                Settings = settings,
                Protocol = DownloadProtocol.Torrent,
                SupportsRss = SupportsRss,
                SupportsSearch = SupportsSearch
            };
        }

        private GazelleSettings GetSettings(string url)
        {
            var settings = new GazelleSettings { BaseUrl = url };

            return settings;
        }
    }
}
