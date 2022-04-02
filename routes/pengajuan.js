var express = require("express");
var router = express.Router();
var authentication_mdl = require("../middlewares/authentication");
var session_store;
/* GET Pengajuan page. */

router.get("/", authentication_mdl.is_login, function (req, res, next) {
  req.getConnection(function (err, connection) {
    var query = connection.query(
      "SELECT * FROM pengajuan",
      function (err, rows) {
        if (err) var errornya = ("Error Selecting : %s ", err);
        req.flash("msg_error", errornya);
        res.render("pengajuan/list", {
          title: "Data Pengajuan",
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
      var pengajuan = {
        id: req.params.id,
      };

      var delete_sql = "delete from pengajuan where ?";
      req.getConnection(function (err, connection) {
        var query = connection.query(
          delete_sql,
          pengajuan,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Delete : %s ", err);
              req.flash("msg_error", errors_detail);
              res.redirect("/pengajuan");
            } else {
              req.flash("msg_info", "Delete Data Pengajuan Success");
              res.redirect("/pengajuan");
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
        "SELECT * FROM pengajuan where id=" + req.params.id,
        function (err, rows) {
          if (err) {
            var error_detail = ("Error Selecting : %s ", err);
            req.flash("msg_error", errors_detail);
            res.redirect("/pengajuan");
          } else {
            if (rows.length <= 0) {
              req.flash("msg_error", "Pengajuan tidak ditemukan!");
              res.redirect("/pengajuan");
            } else {
              console.log(rows);
              res.render("pengajuan/edit", {
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
    req.assert("nama_peminjam", "Harap isi Nama!").notEmpty();
    var errors = req.validationErrors();
    if (!errors) {
      v_nama_peminjam = req.sanitize("nama_peminjam").escape().trim();
      v_no_telp = req.sanitize("no_telp").escape().trim();
      v_nama_barang = req.sanitize("nama_barang").escape().trim();
      v_jumlah = req.sanitize("jumlah").escape().trim();
      v_kondisi_barang = req.sanitize("kondisi_barang").escape().trim();
      v_tgl_pinjam = req.sanitize("tgl_pinjam").escape().trim();
      v_tgl_kembali = req.sanitize("tgl_kembali").escape();

      var pengajuan = {
        nama_peminjam: v_nama_peminjam,
        no_telp: v_no_telp,
        nama_barang: v_nama_barang,
        jumlah: v_jumlah,
        kondisi_barang: v_kondisi_barang,
        tgl_pinjam: v_tgl_pinjam,
        tgl_kembali: v_tgl_kembali

      };

      var update_sql = "update pengajuan SET ? where id = " + req.params.id;
      req.getConnection(function (err, connection) {
        var query = connection.query(
          update_sql,
          pengajuan,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Update : %s ", err);
              req.flash("msg_error", errors_detail);
              res.render("pengajuan/edit", {
                nama_peminjam: req.param("nama_peminjam"),
                no_telp: req.param("no_telp"),
                nama_barang: req.param("nama_barang"),
                jumlah: req.param("jumlah"),
                kondisi_barang: req.param("kondisi_barang"),
                tgl_pinjam: req.param("tgl_pinjam"),
                tgl_kembali: req.param("tgl_kembali"),
              });
            } else {
              req.flash("msg_info", "Update pengajuan success");
              res.redirect("/pengajuan/edit/" + req.params.id);
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
      res.redirect("/pengajuan/edit/" + req.params.id);
    }
  }
);

router.post("/add", authentication_mdl.is_login, function (req, res, next) {
  req.assert("nama_peminjam", "Harap isi Nama!").notEmpty();
  var errors = req.validationErrors();
  if (!errors) {
    v_nama_peminjam = req.sanitize("nama_peminjam").escape().trim();
    v_no_telp = req.sanitize("no_telp").escape().trim();
    v_nama_barang = req.sanitize("nama_barang").escape().trim();
    v_jumlah = req.sanitize("jumlah").escape().trim();
    v_kondisi_barang = req.sanitize("kondisi_barang").escape().trim();
    v_tgl_pinjam = req.sanitize("tgl_pinjam").escape().trim();
    v_tgl_kembali = req.sanitize("tgl_kembali").escape();

    var pengajuan = {
      nama_peminjam: v_nama_peminjam,
      no_telp: v_no_telp,
      nama_barang: v_nama_barang,
      jumlah: v_jumlah,
      kondisi_barang: v_kondisi_barang,
      tgl_pinjam: v_tgl_pinjam,
      tgl_kembali: v_tgl_kembali
    };

    var insert_sql = "INSERT INTO pengajuan SET ?";
    req.getConnection(function (err, connection) {
      var query = connection.query(
        insert_sql,
        pengajuan,
        function (err, result) {
          if (err) {
            var errors_detail = ("Error Insert : %s ", err);
            req.flash("msg_error", errors_detail);
            res.render("pengajuan/add-pengajuan", {
              nama_peminjam: req.param("nama_peminjam"),
              no_telp: req.param("no_telp"),
              nama_barang: req.param("nama_barang"),
              jumlah: req.param("jumlah"),
              kondisi_barang: req.param("kondisi_barang"),
              tgl_pinjam: req.param("tgl_pinjam"),
              tgl_kembali: req.param("tgl_kembali"),
              session_store: req.session,
            });
          } else {
            req.flash("msg_info", "Pengajuan berhasil ditambahkan!");
            res.redirect("/pengajuan");
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
    res.render("pengajuan/add-pengajuan", {
      nama_peminjam: req.param("nama_peminjam"),
      tgl_pinjam: req.param("tgl_pinjam"),
      tgl_kembali: req.param("tgl_kembali"),
      session_store: req.session,
    });
  }
});

router.get("/add", authentication_mdl.is_login, function (req, res, next) {
  res.render("pengajuan/add-pengajuan", {
    title: "Tambahkan Pengajuan",
    nama_peminjam: "",
    no_telp: "",
    nama_barang: "",
    jumlah: "",
    kondisi_barang: "",
    tgl_pinjam: "",
    tgl_kembali: "",
    session_store: req.session,
  });
});

module.exports = router;