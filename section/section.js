document.getElementById("logout").addEventListener("click", function () {
  sessionStorage.removeItem("owner_id");
  sessionStorage.removeItem("user_id");
  sessionStorage.removeItem("level");
  sessionStorage.removeItem("nama");
  alert("Logout clicked!");
  window.location.href = "login.html";
});

if (owner_id || user_id || level || nama) {
  const welcomeMessageSpan = document.getElementById("nameUser");
  welcomeMessageSpan.textContent = `${nama}`;
}

// Global
$(function () {
  let sidebar_nicescroll_opts = {
      cursoropacitymin: 0,
      cursoropacitymax: 0.8,
      zindex: 892,
    },
    now_layout_class = null;

  var sidebar_sticky = function () {
    if ($("body").hasClass("layout-2")) {
      $("body.layout-2 #sidebar-wrapper").stick_in_parent({
        parent: $("body"),
      });
      $("body.layout-2 #sidebar-wrapper").stick_in_parent({ recalc_every: 1 });
    }
  };
  sidebar_sticky();

  var sidebar_nicescroll;
  var update_sidebar_nicescroll = function () {
    let a = setInterval(function () {
      if (sidebar_nicescroll != null) sidebar_nicescroll.resize();
    }, 10);

    setTimeout(function () {
      clearInterval(a);
    }, 600);
  };

  var sidebar_dropdown = function () {
    if ($(".main-sidebar").length) {
      $(".main-sidebar").niceScroll(sidebar_nicescroll_opts);
      sidebar_nicescroll = $(".main-sidebar").getNiceScroll();

      $(".main-sidebar .sidebar-menu li a.has-dropdown")
        .off("click")
        .on("click", function () {
          var me = $(this);
          me.parent()
            .find("> .dropdown-menu")
            .slideToggle(500, function () {
              update_sidebar_nicescroll();
              return false;
            });
          return false;
        });
    }
  };
  sidebar_dropdown();

  if ($("#top-5-scroll").length) {
    $("#top-5-scroll").css({ height: 315 }).niceScroll();
  }

  $(".main-content").css({ minHeight: $(window).outerHeight() - 95 });

  $(".nav-collapse-toggle").click(function () {
    $(this).parent().find(".navbar-nav").toggleClass("show");
    return false;
  });

  $(document).on("click", function () {
    $(".nav-collapse .navbar-nav").removeClass("show");
  });

  var toggle_sidebar_mini = function (mini) {
    let body = $("body");

    if (!mini) {
      body.removeClass("sidebar-mini");
      $(".main-sidebar").css({ overflow: "hidden" });
      setTimeout(function () {
        $(".main-sidebar").niceScroll(sidebar_nicescroll_opts);
        sidebar_nicescroll = $(".main-sidebar").getNiceScroll();
      }, 500);
      $(".main-sidebar .sidebar-menu > li > ul .dropdown-title").remove();
      $(".main-sidebar .sidebar-menu > li > a")
        .removeAttr("data-toggle")
        .removeAttr("data-original-title")
        .removeAttr("title");
    } else {
      body.addClass("sidebar-mini");
      body.removeClass("sidebar-show");
      sidebar_nicescroll.remove();
      sidebar_nicescroll = null;
      $(".main-sidebar .sidebar-menu > li").each(function () {
        let me = $(this);

        if (me.find("> .dropdown-menu").length) {
          me.find("> .dropdown-menu").hide();
          me.find("> .dropdown-menu").prepend(
            '<li class="dropdown-title pt-3">' + me.find("> a").text() + "</li>"
          );
        } else {
          me.find("> a")
            .attr("data-toggle", "tooltip")
            .attr("data-original-title", me.find("> a").text());
          $("[data-toggle='tooltip']").tooltip({ placement: "right" });
        }
      });
    }
  };

  $("[data-toggle='sidebar']").click(function () {
    var body = $("body"),
      w = $(window);

    if (w.outerWidth() <= 1024) {
      body.removeClass("search-show search-gone");
      if (body.hasClass("sidebar-gone")) {
        body.removeClass("sidebar-gone").addClass("sidebar-show");
      } else {
        body.addClass("sidebar-gone").removeClass("sidebar-show");
      }

      update_sidebar_nicescroll();
    } else {
      body.removeClass("search-show search-gone");
      if (body.hasClass("sidebar-mini")) {
        toggle_sidebar_mini(false);
      } else {
        toggle_sidebar_mini(true);
      }
    }

    return false;
  });

  var toggleLayout = function () {
    var w = $(window),
      layout_class = $("body").attr("class") || "",
      layout_classes =
        layout_class.trim().length > 0 ? layout_class.split(" ") : "";

    if (layout_classes.length > 0) {
      layout_classes.forEach(function (item) {
        if (item.indexOf("layout-") != -1) {
          now_layout_class = item;
        }
      });
    }

    if (w.outerWidth() <= 1024) {
      if ($("body").hasClass("sidebar-mini")) {
        toggle_sidebar_mini(false);
        $(".main-sidebar").niceScroll(sidebar_nicescroll_opts);
        sidebar_nicescroll = $(".main-sidebar").getNiceScroll();
      }

      $("body")
        .addClass("sidebar-gone")
        .removeClass("layout-2 layout-3 sidebar-mini sidebar-show");
      $("body")
        .off("click")
        .on("click", function (e) {
          if (
            $(e.target).hasClass("sidebar-show") ||
            $(e.target).hasClass("search-show")
          ) {
            $("body")
              .removeClass("sidebar-show")
              .addClass("sidebar-gone")
              .removeClass("search-show");
            update_sidebar_nicescroll();
          }
        });

      update_sidebar_nicescroll();

      if (now_layout_class == "layout-3") {
        let nav_second_classes = $(".navbar-secondary").attr("class"),
          nav_second = $(".navbar-secondary");

        nav_second.attr("data-nav-classes", nav_second_classes);
        nav_second.removeAttr("class").addClass("main-sidebar");

        let main_sidebar = $(".main-sidebar");
        main_sidebar
          .find(".container")
          .addClass("sidebar-wrapper")
          .removeClass("container");
        main_sidebar
          .find(".navbar-nav")
          .addClass("sidebar-menu")
          .removeClass("navbar-nav");
        main_sidebar.find(".sidebar-menu .nav-item.dropdown.show a").click();
        main_sidebar.find(".sidebar-brand").remove();
        main_sidebar.find(".sidebar-menu").before(
          $("<div>", {
            class: "sidebar-brand",
          }).append(
            $("<a>", {
              href: $(".navbar-brand").attr("href"),
            }).html($(".navbar-brand").html())
          )
        );

        setTimeout(function () {
          sidebar_nicescroll = main_sidebar.niceScroll(sidebar_nicescroll_opts);
          sidebar_nicescroll = main_sidebar.getNiceScroll();
        }, 700);

        sidebar_dropdown();
        $(".main-wrapper").removeClass("container");
      }
    } else {
      $("body").removeClass("sidebar-gone sidebar-show");
      if (now_layout_class) $("body").addClass(now_layout_class);

      let nav_second_classes = $(".main-sidebar").attr("data-nav-classes"),
        nav_second = $(".main-sidebar");

      if (
        now_layout_class == "layout-3" &&
        nav_second.hasClass("main-sidebar")
      ) {
        nav_second.find(".sidebar-menu li a.has-dropdown").off("click");
        nav_second.find(".sidebar-brand").remove();
        nav_second.removeAttr("class").addClass(nav_second_classes);

        let main_sidebar = $(".navbar-secondary");
        main_sidebar
          .find(".sidebar-wrapper")
          .addClass("container")
          .removeClass("sidebar-wrapper");
        main_sidebar
          .find(".sidebar-menu")
          .addClass("navbar-nav")
          .removeClass("sidebar-menu");
        main_sidebar.find(".dropdown-menu").hide();
        main_sidebar
          .removeAttr("style")
          .removeAttr("tabindex")
          .removeAttr("data-nav-classes");
        $(".main-wrapper").addClass("container");
      } else if (now_layout_class == "layout-2") {
        $("body").addClass("layout-2");
      } else {
        update_sidebar_nicescroll();
      }
    }
  };
  toggleLayout();
  $(window).resize(toggleLayout);

  $("[data-toggle='search']").click(function () {
    var body = $("body");
    body.toggleClass("search-gone search-show");
  });

  $("[data-toggle='tooltip']").tooltip();

  $('[data-toggle="popover"]').popover({ container: "body" });

  if (jQuery().select2) $(".select2").select2();

  if (jQuery().selectric) {
    $(".selectric").selectric({
      disableOnMobile: false,
      nativeOnMobile: false,
    });
  }

  $(".notification-toggle").dropdown();
  $(".notification-toggle")
    .parent()
    .on("shown.bs.dropdown", function () {
      $(".dropdown-list-icons").niceScroll({
        cursoropacitymin: 0.3,
        cursoropacitymax: 0.8,
        cursorwidth: 7,
      });
    });

  $(".message-toggle").dropdown();
  $(".message-toggle")
    .parent()
    .on("shown.bs.dropdown", function () {
      $(".dropdown-list-message").niceScroll({
        cursoropacitymin: 0.3,
        cursoropacitymax: 0.8,
        cursorwidth: 7,
      });
    });

  if ($(".chat-content").length) {
    $(".chat-content").niceScroll({
      cursoropacitymin: 0.3,
      cursoropacitymax: 0.8,
    });
    $(".chat-content")
      .getNiceScroll(0)
      .doScrollTop($(".chat-content").height());
  }

  if (jQuery().summernote) {
    $(".summernote").summernote({
      dialogsInBody: true,
      minHeight: 250,
    });
  }

  if (window.CodeMirror) {
    $(".codeeditor").each(function () {
      let editor = CodeMirror.fromTextArea(this, {
        lineNumbers: true,
        theme: "duotone-dark",
        mode: "javascript",
        height: 200,
      });
      editor.setSize("100%", 200);
    });
  }
});

document.addEventListener('DOMContentLoaded', function() {
    // Toggle dropdown profile
    const userMenuButton = document.getElementById('userMenuButton');
    const userDropdown = document.getElementById('userDropdown');
    
    userMenuButton.addEventListener('click', function() {
        userDropdown.classList.toggle('hidden');
    });
    
    // Tutup dropdown ketika klik di luar
    document.addEventListener('click', function(event) {
        if (!userMenuButton.contains(event.target) && !userDropdown.contains(event.target)) {
            userDropdown.classList.add('hidden');
        }
    });
    
    // Toggle sidebar mobile
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const sidebar = document.getElementById('sidebar');
    
    mobileMenuButton.addEventListener('click', function() {
        sidebar.classList.toggle('-translate-x-full');
        sidebar.classList.toggle('sm:translate-x-0');
    });
    
    // Tutup sidebar mobile ketika klik menu item (opsional)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 640) { // Hanya untuk mobile
                sidebar.classList.add('-translate-x-full');
                sidebar.classList.remove('sm:translate-x-0');
            }
        });
    });
});
