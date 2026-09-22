export const LEGACY_PREFERENCE_MIGRATE_SCRIPT = `
(function () {
  try {
    var oneYear = 31536000;
    function hasCookie(name) {
      return document.cookie.split(";").some(function (part) {
        return part.trim().indexOf(name + "=") === 0;
      });
    }
    function writeCookie(name, value) {
      document.cookie = name + "=" + value + ";path=/;max-age=" + oneYear + ";SameSite=Lax";
    }
    if (!hasCookie("language")) {
      var lang = localStorage.getItem("language");
      if (lang === "en" || lang === "pt") writeCookie("language", lang);
    }
    if (!hasCookie("theme")) {
      var theme = localStorage.getItem("theme");
      if (theme === "light" || theme === "dark") writeCookie("theme", theme);
    }
  } catch (_) {}
})();
`.trim();
