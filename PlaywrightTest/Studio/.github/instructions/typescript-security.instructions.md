<!DOCTYPE html>
<html class="html-devise-layout gl-system" lang="en">
<head>
<meta charset="utf-8">
<meta content="IE=edge" http-equiv="X-UA-Compatible">
<meta content="width=device-width, initial-scale=1" name="viewport">
<title>Sign in · GitLab</title>
<script>
//<![CDATA[
window.gon={};gon.api_version="v4";gon.default_avatar_url="https://gitlab.veritran.net/assets/no_avatar-849f9c04a3a0d0cea2424ae97b27447dc64a7dbfae83c036c45b403392f0e8ba.png";gon.max_file_size=50;gon.asset_host=null;gon.webpack_public_path="/assets/webpack/";gon.relative_url_root="";gon.user_color_mode="gl-system";gon.user_color_scheme="white";gon.markdown_surround_selection=null;gon.markdown_automatic_lists=null;gon.markdown_maintain_indentation=null;gon.math_rendering_limits_enabled=true;gon.iframe_rendering_enabled=false;gon.iframe_rendering_allowlist=[];gon.recaptcha_api_server_url="https://www.recaptcha.net/recaptcha/api.js";gon.recaptcha_sitekey=null;gon.gitlab_url="https://gitlab.veritran.net";gon.promo_url="https://about.gitlab.com";gon.forum_url="https://forum.gitlab.com";gon.docs_url="https://docs.gitlab.com";gon.revision="3e2b4f03bca";gon.feature_category="system_access";gon.gitlab_logo="/assets/gitlab_logo-2957169c8ef64c58616a1ac3f4fc626e8a35ce4eb3ed31bb0d873712f2a041a0.png";gon.secure=true;gon.sprite_icons="/assets/icons-41229992eca580608aadaaa9b83b717650b2863442574d0ebb87f859c42a3b6c.svg";gon.sprite_file_icons="/assets/file_icons/file_icons-90de312d3dbe794a19dee8aee171f184ff69ca9c9cf9fe37e8b254e84c3a1543.svg";gon.illustrations_path="/images/illustrations.svg";gon.emoji_sprites_css_path="/assets/emoji_sprites-bd26211944b9d072037ec97cb138f1a52cd03ef185cd38b8d1fcc963245199a1.css";gon.emoji_backend_version=4;gon.gridstack_css_path="/assets/lazy_bundles/gridstack-f42069e5c7b1542688660592b48f2cbd86e26b77030efd195d124dbd8fe64434.css";gon.test_env=false;gon.disable_animations=false;gon.suggested_label_colors={"#cc338b":"Magenta-pink","#dc143c":"Crimson","#c21e56":"Rose red","#cd5b45":"Dark coral","#ed9121":"Carrot orange","#eee600":"Titanium yellow","#009966":"Green-cyan","#8fbc8f":"Dark sea green","#6699cc":"Blue-gray","#e6e6fa":"Lavender","#9400d3":"Dark violet","#330066":"Deep violet","#36454f":"Charcoal grey","#808080":"Gray"};gon.first_day_of_week=0;gon.time_display_relative=true;gon.time_display_format=0;gon.ee=false;gon.jh=false;gon.dot_com=false;gon.uf_error_prefix="UF";gon.pat_prefix="glpat-";gon.keyboard_shortcuts_enabled=true;gon.broadcast_message_dismissal_path=null;gon.diagramsnet_url="https://embed.diagrams.net";gon.features={"uiForOrganizations":false,"organizationSwitching":false,"findAndReplace":false,"removeMonitorMetrics":true,"newProjectCreationForm":false,"workItemsClientSideBoards":false,"glqlWorkItems":true,"glqlAggregation":false,"glqlTypescript":false,"projectStudioEnabled":true,"securityManagerRoleEnabled":false,"passkeys":true,"signInFormVue":true,"twoStepSignIn":false};
//]]>
</script>

<script>
//<![CDATA[
const root = document.documentElement;
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  root.classList.add('gl-dark');
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (e.matches) {
    root.classList.add('gl-dark');
  } else {
    root.classList.remove('gl-dark');
  }
});

//]]>
</script>




<meta content="light dark" name="color-scheme">
<link rel="stylesheet" href="/assets/application-a525a9c3daa1038938085abda446450bfe2d6baa47f15350d586ae0f5adb0c07.css" media="(prefers-color-scheme: light)" />
<link rel="stylesheet" href="/assets/application_dark-42668a4432435baac4d8f78933673d975b723cd8b6d5282a6069d14b109b115f.css" media="(prefers-color-scheme: dark)" />
<link rel="stylesheet" href="/assets/page_bundles/login-7240ec00cf3969b710fe5e8959f8ef8eeff66d635ded28839b1b4256ae8d96a3.css" /><link rel="stylesheet" href="/assets/page_bundles/commit_description-9e7efe20f0cef17d0606edabfad0418e9eb224aaeaa2dae32c817060fa60abcc.css" /><link rel="stylesheet" href="/assets/page_bundles/work_items-af321897c3b1ae7c1f6f0cb993681211b837df7ec8e5ff59e3795fd08ab83a13.css" /><link rel="stylesheet" href="/assets/page_bundles/notes_shared-8f7a9513332533cc4a53b3be3d16e69570e82bc87b3f8913578eaeb0dce57e21.css" />
<link rel="stylesheet" href="/assets/tailwind_cqs-15f40f04ff54d50d70cce143d1d2fe1fc5c721ac1c17ab7fb3f04b23f468a9b2.css" />


<link rel="stylesheet" href="/assets/fonts-deb7ad1d55ca77c0172d8538d53442af63604ff490c74acc2859db295c125bdb.css" />
<link rel="stylesheet" href="/assets/highlight/themes/white-9c3096bebbc271536c91d4e96afdef34cf54f198accca96d32008405a3a398da.css" media="(prefers-color-scheme: light)" />
<link rel="stylesheet" href="/assets/highlight/themes/dark-bab508e186c8119f0cfb965d3a8a74c6ee2b10c5d2cf129a41c0bc522b98655d.css" media="(prefers-color-scheme: dark)" />

<script src="/assets/webpack/runtime.c036656d.bundle.js" defer="defer"></script>
<script src="/assets/webpack/main.9066bdd1.chunk.js" defer="defer"></script>
<script src="/assets/webpack/tracker.f99708a3.chunk.js" defer="defer"></script>
<script>
//<![CDATA[
window.snowplowOptions = {"namespace":"gl","hostname":"gitlab.veritran.net:443","postPath":"/-/collect_events","forceSecureTracker":true,"appId":"gitlab_sm"};
gl = window.gl || {};
gl.snowplowStandardContext = {"schema":"iglu:com.gitlab/gitlab_standard/jsonschema/1-1-7","data":{"environment":"self-managed","source":"gitlab-rails","correlation_id":"01KMG9K9D0M7V878D7587W48DK","extra":{},"user_id":null,"global_user_id":null,"user_type":null,"is_gitlab_team_member":null,"namespace_id":null,"ultimate_parent_namespace_id":null,"project_id":null,"feature_enabled_by_namespace_ids":null,"realm":"self-managed","deployment_type":"self-managed","context_generated_at":"2026-03-24T16:07:13.631Z"}};
gl.snowplowPseudonymizedPageUrl = "https://gitlab.veritran.net/users/sign_in";
gl.maskedDefaultReferrerUrl = null;
gl.ga4MeasurementId = 'G-ENFH3X7M5Y';
gl.duoEvents = [];
gl.onlySendDuoEvents = true;


//]]>
</script>
<link rel="preload" href="/assets/application-a525a9c3daa1038938085abda446450bfe2d6baa47f15350d586ae0f5adb0c07.css" as="style" type="text/css">
<link rel="preload" href="/assets/highlight/themes/white-9c3096bebbc271536c91d4e96afdef34cf54f198accca96d32008405a3a398da.css" as="style" type="text/css">




<script src="/assets/webpack/commons-pages.explore.catalog-pages.groups.harbor.repositories-pages.groups.issues-pages.groups.new--aa29c505.2054bcd5.chunk.js" defer="defer"></script>
<script src="/assets/webpack/commons-pages.search.show-super_sidebar.74556b00.chunk.js" defer="defer"></script>
<script src="/assets/webpack/super_sidebar.130307a1.chunk.js" defer="defer"></script>
<script src="/assets/webpack/commons-pages.admin.sessions-pages.ldap.omniauth_callbacks-pages.omniauth_callbacks-pages.sessions-p-ea3be603.c73c78ad.chunk.js" defer="defer"></script>
<script src="/assets/webpack/commons-pages.registrations.new-pages.sessions.new.3a03de8f.chunk.js" defer="defer"></script>
<script src="/assets/webpack/pages.sessions.new.e1ff2262.chunk.js" defer="defer"></script>



<meta name="csrf-param" content="authenticity_token" />
<meta name="csrf-token" content="YK8A6Qp13u86DP6YsiMO4ytk60hIPCIBZ_FdrHJZU2Ahpcx7QOpXCmsYKS62noEZlaFDxxDpi09jwoIIq7m1vA" />
<meta name="csp-nonce" />
<meta name="action-cable-url" content="/-/cable" />
<link href="/-/manifest.json" rel="manifest">
<link rel="icon" type="image/png" href="/assets/favicon-72a2cad5025aa931d6ea56c3201d1f18e68a8cd39788c7c80d5b2b82aa5143ef.png" id="favicon" data-original-href="/assets/favicon-72a2cad5025aa931d6ea56c3201d1f18e68a8cd39788c7c80d5b2b82aa5143ef.png" />
<link rel="apple-touch-icon" type="image/x-icon" href="/assets/apple-touch-icon-b049d4bc0dd9626f31db825d61880737befc7835982586d015bded10b4435460.png" />
<link href="/search/opensearch.xml" rel="search" title="Search GitLab" type="application/opensearchdescription+xml">




<meta content="GitLab Server" name="description">
<meta content="#F1F0F6" media="(prefers-color-scheme: light)" name="theme-color">
<meta content="#232128" media="(prefers-color-scheme: dark)" name="theme-color">
</head>

<body class="gl-h-full login-page gl-browser-generic gl-platform-windows" data-page="sessions:new" data-testid="login-page">

<script>
//<![CDATA[
gl = window.gl || {};
gl.client = {"isGeneric":true,"isWindows":true};


//]]>
</script>




<div class="gl-h-full gl-flex gl-flex-wrap">
<div class="container gl-self-center">
<main class="content">
<div class="flash-container flash-container-page sticky" data-testid="flash-container">
<div class="gl-alert gl-alert-info gl-alert-not-dismissible" role="alert">
<div class="gl-alert-icon-container">
<svg class="s16 gl-alert-icon gl-alert-icon-no-title" data-testid="information-o-icon"><use href="/assets/icons-41229992eca580608aadaaa9b83b717650b2863442574d0ebb87f859c42a3b6c.svg#information-o"></use></svg>
</div>
<div class="gl-alert-content" role="alert">
<div class="gl-alert-body">
<div class="gl-flex gl-items-center">
<div class="gl-grow">
Sign in before continuing.
</div>
</div>

</div>
</div>
</div>

<div id="js-global-alerts"></div>
</div>

<div class="gl-my-5">
<div class="col-sm-12 gl-text-center">
<img alt="GitLab Server" class="gl-invisible gl-h-10 js-portrait-logo-detection lazy" data-src="/uploads/-/system/appearance/logo/1/VTLogo.png" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
<h1 class="mb-3 gl-text-size-h2">
GitLab Server
</h1>
</div>
<div class="gl-w-full gl-ml-auto gl-mr-auto bar sm:gl-w-1/2">

<div class="js-non-oauth-login">
<ul class="-gl-mx-5 gl-my-5 nav-justified nav gl-tabs-nav" id="js-signin-tabs" role="tablist"><li role="presentation" class="nav-item"><a data-toggle="tab" data-testid="ldap-tab" role="tab" class="nav-link gl-tab-nav-item active gl-tab-nav-item-active" href="#ldapmain">LDAP</a></li>

<li role="presentation" class="nav-item"><a data-toggle="tab" data-testid="standard-tab" role="tab" class="nav-link gl-tab-nav-item" href="#login-pane">Standard</a></li>
</ul><div class="tab-content">
<div class="tab-pane active" id="ldapmain" role="tabpanel">
<form class="gl-show-field-errors" aria-live="assertive" data-testid="new_ldap_user" action="/users/auth/ldapmain/callback" accept-charset="UTF-8" method="post"><input type="hidden" name="authenticity_token" value="5OzfOID2U_CpU0I45uAMQACTTMU-88ADqCALsM2dOBOl5hOqymnaFfhHlY7iXYO6vlbkSmYmaU2sE9QUFH3ezw" autocomplete="off" /><div class="form-group">
<label for="ldapmain_username">Username</label>
<input name="username" autocomplete="username" class="form-control gl-form-input" title="This field is required." autofocus="autofocus" data-testid="username-field" required="required" type="text" id="ldapmain_username" />
</div>
<div class="form-group">
<label for="ldapmain_password">Password</label>
<input class="form-control gl-form-input js-password" data-id="ldapmain_password" data-name="password" data-testid="password-field">
</div>
<div class="gl-mb-3">
<div class="gl-form-checkbox custom-control custom-checkbox">
<input name="remember_me" type="hidden" value="0" autocomplete="off" /><input name="remember_me" autocomplete="off" class="custom-control-input" type="checkbox" value="1" id="ldapmain_remember_me" />
<label class="custom-control-label" for="ldapmain_remember_me"><span>Remember me</span></label>
</div>

</div>
<button data-testid="sign-in-button" type="submit" class="gl-button btn btn-block btn-md btn-confirm "><span class="gl-button-text">
Sign in

</span>

</button></form>
</div>

<div class="tab-pane" id="login-pane" role="tabpanel">
<div data-app-data="{&quot;sign_in_path&quot;:&quot;/users/sign_in&quot;,&quot;users_sign_in_path_path&quot;:&quot;/users/sign_in_path&quot;,&quot;passkeys_sign_in_path&quot;:&quot;/users/passkeys/sign_in&quot;,&quot;is_unconfirmed_email&quot;:false,&quot;new_user_confirmation_path&quot;:&quot;/users/confirmation/new&quot;,&quot;new_password_path&quot;:&quot;/users/password/new&quot;,&quot;show_captcha&quot;:false,&quot;is_remember_me_enabled&quot;:true}" id="js-sign-in-form">
<div class="gl-spinner-container gl-my-5" role="status"><span aria-hidden class="gl-spinner gl-spinner-md gl-spinner-dark !gl-align-text-bottom"></span><span class="gl-sr-only !gl-absolute">Loading</span>
</div>
<form action="/users/sign_in" accept-charset="UTF-8" method="post"><input type="hidden" name="authenticity_token" value="w84AtaXm8AuFknUygwwu9Dt1_ihc9o3yXNWALg2ypumCxMwn73l57tSGooSHsaEOhbBWpwQjJLxY5l-K1FJANQ" autocomplete="off" /><input data-js-name="login" autocomplete="off" type="hidden" name="user[login]" id="user_login" />
<input data-js-name="password" autocomplete="off" type="hidden" name="user[password]" id="user_password" />
<input data-js-name="rememberMe" autocomplete="off" type="hidden" name="user[remember_me]" id="user_remember_me" />
</form></div>

</div>
</div>

</div>

</div>
</div>
</main>
</div>
<div class="footer-container gl-w-full gl-self-end">
<hr class="gl-m-0">
<div class="container gl-py-5 gl-flex gl-justify-between gl-items-start">
<div class="gl-hidden md:gl-flex gl-gap-5 gl-flex-wrap">
<a href="/explore">Explore</a>
<a href="/help">Help</a>
<a href="https://about.gitlab.com">About GitLab</a>
<a target="_blank" class="text-nowrap" rel="noopener noreferrer" href="https://forum.gitlab.com">GitLab community forum</a>
</div>
<div class="js-language-switcher" data-locales="[{&quot;value&quot;:&quot;en&quot;,&quot;percentage&quot;:100,&quot;text&quot;:&quot;English&quot;},{&quot;value&quot;:&quot;it&quot;,&quot;percentage&quot;:99,&quot;text&quot;:&quot;italiano&quot;},{&quot;value&quot;:&quot;ga_IE&quot;,&quot;percentage&quot;:99,&quot;text&quot;:&quot;Irish&quot;},{&quot;value&quot;:&quot;fr&quot;,&quot;percentage&quot;:99,&quot;text&quot;:&quot;français&quot;},{&quot;value&quot;:&quot;pt_BR&quot;,&quot;percentage&quot;:98,&quot;text&quot;:&quot;português (Brasil)&quot;},{&quot;value&quot;:&quot;es&quot;,&quot;percentage&quot;:98,&quot;text&quot;:&quot;español&quot;},{&quot;value&quot;:&quot;ko&quot;,&quot;percentage&quot;:97,&quot;text&quot;:&quot;한국어&quot;},{&quot;value&quot;:&quot;ja&quot;,&quot;percentage&quot;:97,&quot;text&quot;:&quot;日本語&quot;},{&quot;value&quot;:&quot;de&quot;,&quot;percentage&quot;:94,&quot;text&quot;:&quot;Deutsch&quot;}]"></div>

</div>
</div>


</div>
</body>
</html>
