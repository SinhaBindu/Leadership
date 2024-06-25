using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Leadership.Startup))]
namespace Leadership
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
