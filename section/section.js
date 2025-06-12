// Logout
document.getElementById("logout").addEventListener("click", () => {
  sessionStorage.removeItem("owner_id");
  sessionStorage.removeItem("user_id");
  sessionStorage.removeItem("level");
  sessionStorage.removeItem("nama");
  alert("Logout clicked!");
  window.location.href = "login.html";
});

// Set nama user jika tersedia
const nama = sessionStorage.getItem("nama");
if (nama) {
  document.getElementById("nameUser").textContent = nama;
}

// Global jQuery Initialization
$(() => {
  const sidebarScrollOpts = {
    cursoropacitymin: 0,
    cursoropacitymax: 0.8,
    zindex: 892,
  };

  let sidebarScroll = null;

  const initSidebarScroll = () => {
    if ($(".main-sidebar").length) {
      $(".main-sidebar").niceScroll(sidebarScrollOpts);
      sidebarScroll = $(".main-sidebar").getNiceScroll();
    }
  };

  const updateSidebarScroll = () => {
    const interval = setInterval(() => {
      if (sidebarScroll) sidebarScroll.resize();
    }, 10);
    setTimeout(() => clearInterval(interval), 600);
  };

  const handleDropdownClick = () => {
    $(".main-sidebar .sidebar-menu li a.has-dropdown")
      .off("click")
      .on("click", function () {
        $(this)
          .siblings(".dropdown-menu")
          .slideToggle(500, updateSidebarScroll);
        return false;
      });
  };

  const handleMiniSidebarToggle = (mini) => {
    const $body = $("body");
    if (mini) {
      $body.addClass("sidebar-mini").removeClass("sidebar-show");
      if (sidebarScroll) {
        sidebarScroll.remove();
        sidebarScroll = null;
      }
      $(".main-sidebar .sidebar-menu > li").each(function () {
        const $li = $(this);
        const $a = $li.children("a");
        if ($li.children(".dropdown-menu").length) {
          $li
            .children(".dropdown-menu")
            .hide()
            .prepend(`<li class="dropdown-title pt-3">${$a.text()}</li>`);
        } else {
          $a.attr({
            "data-toggle": "tooltip",
            "data-original-title": $a.text(),
            title: $a.text(),
          });
          $("[data-toggle='tooltip']").tooltip({ placement: "right" });
        }
      });
    } else {
      $body.removeClass("sidebar-mini");
      $(".main-sidebar").css({ overflow: "hidden" });
      setTimeout(() => {
        $(".main-sidebar").niceScroll(sidebarScrollOpts);
        sidebarScroll = $(".main-sidebar").getNiceScroll();
      }, 500);
    }
  };

  const toggleLayout = () => {
    const w = $(window).outerWidth();
    const $body = $("body");
    const currentLayout =
      [...$body[0].classList].find((c) => c.startsWith("layout-")) || "";

    if (w <= 1024) {
      if ($body.hasClass("sidebar-mini")) handleMiniSidebarToggle(false);
      $body
        .addClass("sidebar-gone")
        .removeClass("sidebar-show layout-2 layout-3 sidebar-mini");

      $body.off("click").on("click", (e) => {
        if (
          $(e.target).hasClass("sidebar-show") ||
          $(e.target).hasClass("search-show")
        ) {
          $body
            .removeClass("sidebar-show search-show")
            .addClass("sidebar-gone");
          updateSidebarScroll();
        }
      });
    } else {
      $body.removeClass("sidebar-gone sidebar-show").addClass(currentLayout);
      updateSidebarScroll();
    }
  };

  // Event Bindings
  $("[data-toggle='sidebar']").on("click", (e) => {
    const w = $(window).outerWidth();
    const $body = $("body");

    if (w <= 1024) {
      $body.toggleClass("sidebar-gone sidebar-show");
    } else {
      handleMiniSidebarToggle(!$body.hasClass("sidebar-mini"));
    }

    updateSidebarScroll();
    e.preventDefault();
  });

  $("[data-toggle='search']").click(() => {
    $("body").toggleClass("search-gone search-show");
  });

  $("[data-toggle='tooltip']").tooltip();
  $('[data-toggle="popover"]').popover({ container: "body" });

  // UI Plugins
  if ($.fn.select2) $(".select2").select2();
  if ($.fn.selectric)
    $(".selectric").selectric({
      disableOnMobile: false,
      nativeOnMobile: false,
    });

  if ($("#top-5-scroll").length) {
    $("#top-5-scroll").css({ height: 315 }).niceScroll();
  }

  $(".main-content").css({ minHeight: $(window).outerHeight() - 95 });

  // Notifications & Messages
  $(".notification-toggle, .message-toggle").dropdown();
  $(".notification-toggle")
    .parent()
    .on("shown.bs.dropdown", () => {
      $(".dropdown-list-icons").niceScroll({
        cursoropacitymin: 0.3,
        cursoropacitymax: 0.8,
        cursorwidth: 7,
      });
    });
  $(".message-toggle")
    .parent()
    .on("shown.bs.dropdown", () => {
      $(".dropdown-list-message").niceScroll({
        cursoropacitymin: 0.3,
        cursoropacitymax: 0.8,
        cursorwidth: 7,
      });
    });

  // Chat Scroll
  if ($(".chat-content").length) {
    $(".chat-content").niceScroll({
      cursoropacitymin: 0.3,
      cursoropacitymax: 0.8,
    });
    $(".chat-content")
      .getNiceScroll(0)
      .doScrollTop($(".chat-content").height());
  }

  // Summernote
  if ($.fn.summernote) {
    $(".summernote").summernote({ dialogsInBody: true, minHeight: 250 });
  }

  // CodeMirror
  if (window.CodeMirror) {
    $(".codeeditor").each(function () {
      const editor = CodeMirror.fromTextArea(this, {
        lineNumbers: true,
        theme: "duotone-dark",
        mode: "javascript",
      });
      editor.setSize("100%", 200);
    });
  }

  // Initial Load
  initSidebarScroll();
  handleDropdownClick();
  toggleLayout();
  $(window).resize(toggleLayout);
});
