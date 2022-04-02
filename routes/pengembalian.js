var express = require("express");
var router = express.Router();
var authentication_mdl = require("../middlewares/authentication");
var session_store;
/* GET Pengembalian page. */

router.get("/", authentication_mdl.is_login, function (req, res, next) {
  req.getConnection(function (err, connection) {
    var query = connection.query(
      "SELECT * FROM pengembalian",
      function (err, rows) {
        if (err) var errornya = ("Error Selecting : %s ", err);
        req.flash("msg_error", errornya);
        res.render("pengembalian/list", {
          title: "Pengembalian",
          data: rows,
          session_store: req.session,
        });
      }
    );
    //console.log(query.sql);
  });
});

router.delete(
  "/delete/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.getConnection(function (err, connection) {
      var pengembalian = {
        id: req.params.id,
      };

      var delete_sql = "delete from pengembalian where ?";
      req.getConnection(function (err, connection) {
        var query = connection.query(
          delete_sql,
          pengembalian,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Delete : %s ", err);
              req.flash("msg_error", errors_detail);
              res.redirect("/pengembalian");
            } else {
              req.flash("msg_info", "Delete Data Pengembalian Success");
              res.redirect("/pengembalian");
            }
          }
        );
      });
    });
  }
);
router.get(
  "/edit/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.getConnection(function (err, connection) {
      var query = connection.query(
        "SELECT * FROM pengembalian where id=" + req.params.id,
        function (err, rows) {
          if (err) {
            var errornya = ("Error Selecting : %s ", err);
            req.flash("msg_error", errors_detail);
            res.redirect("/pengembalian");
          } else {
            if (rows.length <= 0) {
              req.flash("msg_error", "Pengembalian tidak ditemukan!");
              res.redirect("/pengembalian");
            } else {
              console.log(rows);
              res.render("pengembalian/edit", {
                title: "Edit ",
                data: rows[0],
                session_store: req.session,
              });
            }
          }
        }
      );
    });
  }
);
router.put(
  "/edit/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.assert("nama_barang", "Harap isi Nama!").notEmpty();
    var errors = req.validationErrors();
    if (!errors) {
      v_nama_barang = req.sanitize("nama_barang").escape().trim();
      v_nama_peminjam = req.sanitize("nama_peminjam").escape().trim();
      v_tgl_kembali = req.sanitize("tgl_kembali").escape().trim();
      v_jatuh_tempo = req.sanitize("jatuh_tempo").escape().trim();
      v_jml_hari = req.sanitize("jml_hari").escape().trim();
      v_total_denda = req.sanitize("total_denda").escape().trim();

      var pengembalian = {
        nama_barang: v_nama_barang,
        nama_peminjam: v_nama_peminjam,
        tgl_kembali: v_tgl_kembali,
        jatuh_tempo: v_jatuh_tempo,
        jml_hari: v_jml_hari,
        total_denda: v_total_denda,
      };

      var update_sql = "update pengembalian SET ? where id = " + req.params.id;
      req.getConnection(function (err, connection) {
        var query = connection.query(
          update_sql,
          pengembalian,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Update : %s ", err);
              req.flash("msg_error", errors_detail);
              res.render("pengembalian/edit", {
                nama_barang: req.param("nama_barang"),
                nama_peminjam: req.param("nama_peminjam"),
                tgl_kembali: req.param("tgl_kembali"),
                jatuh_tempo: req.param("jatuh_tempo"),
                jml_hari: req.param("jml_hari"),
                total_denda: req.param("total_denda"),
              });
            } else {
              req.flash("msg_info", "Update data pengembalian success");
              res.redirect("/pengembalian/edit/" + req.params.id);
            }
          }
        );
      });
    } else {
      console.log(errors);
      errors_detail = "<p>Sory there are error</p><ul>";
      for (i in errors) {
        error = errors[i];
        errors_detail += "<li>" + error.msg + "</li>";
      }
      errors_detail += "</ul>";
      req.flash("msg_error", errors_detail);
      res.redirect("/pengembalian/edit/" + req.params.id);
    }
  }
);

router.post("/add", authentication_mdl.is_login, function (req, res, next) {
  req.assert("nama_barang", "Harap isi Nama!").notEmpty();
  var errors = req.validationErrors();
  if (!errors) {
    v_nama_barang = req.sanitize("nama_barang").escape().trim();
    v_nama_peminjam = req.sanitize("nama_peminjam").escape().trim();
    v_tgl_kembali = req.sanitize("tgl_kembali").escape().trim();
    v_jatuh_tempo = req.sanitize("jatuh_tempo").escape().trim();
    v_jml_hari = req.sanitize("jml_hari").escape().trim();
    v_total_denda = req.sanitize("total_denda").escape().trim();

    var pengembalian = {
      nama_barang: v_nama_barang,
      nama_peminjam: v_nama_peminjam,
      tgl_kembali: v_tgl_kembali,
      jatuh_tempo: v_jatuh_tempo,
      jml_hari: v_jml_hari,
      total_denda: v_total_denda,
    };

    var insert_sql = "INSERT INTO pengembalian SET ?";
    req.getConnection(function (err, connection) {
      var query = connection.query(
        insert_sql,
        pengembalian,
        function (err, result) {
          if (err) {
            var errors_detail = ("Error Insert : %s ", err);
            req.flash("msg_error", errors_detail);
            res.render("pengembalian/add-pengembalian", {
              nama_barang: req.param("nama_barang"),
              nama_peminjam: req.param("nama_peminjam"),
              tgl_kembali: req.param("tgl_kembali"),
              jatuh_tempo: req.param("jatuh_tempo"),
              jml_hari: req.param("jml_hari"),
              total_denda: req.param("total_denda"),
              session_store: req.session,
            });
          } else {
            req.flash("msg_info", "Pengembalian berhasil ditambahkan!");
            res.redirect("/pengembalian");
          }
        }
      );
    });
  } else {
    console.log(errors);
    errors_detail = "<p>Sory there are error</p><ul>";
    for (i in errors) {
      error = errors[i];
      errors_detail += "<li>" + error.msg + "</li>";
    }
    errors_detail += "</ul>";
    req.flash("msg_error", errors_detail);
    res.render("pengembalian/add-pengembalian", {
      nama_barang: req.param("nama_barang"),
      total_denda: req.param("total_denda"),
      session_store: req.session,
    });
  }
});

router.get("/add", authentication_mdl.is_login, function (req, res, next) {
  res.render("pengembalian/add-pengembalian", {
    title: "Tambahkan Pengembalian",
    nama_barang: "",
    nama_peminjam: "",
    tgl_kembali: "",
    jatuh_tempo: "",
    jml_hari: "",
    total_denda: "",
    session_store: req.session,
  });
});

module.exports = router;