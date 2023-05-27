const client_url = "http://52.79.198.239";
const local_url = "http://localhost:3000";
//http://ec2-52-79-198-239.ap-northeast-2.compute.amazonaws.com
const url = "http://ec2-52-79-198-239.ap-northeast-2.compute.amazonaws.com";

const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./config/db");
const cookieParser = require("cookie-parser");
const session = require("express-session");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({ credentials: true, origin: local_url, methods: ["GET", "POST"] })
);
app.use(cookieParser());
app.use(
  session({
    key: "user",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 1000 * 60 * 60 * 24,
    },
  })
);
const multer = require("multer");
const path = require("path");
const mime = require("mime-types");
const { v4: uuid } = require("uuid");
const fs = require("fs-extra");
const nodemailer = require("nodemailer");

// 회원가입하기
app.post("/api/register", (req, res) => {
  const inputId = req.body.inputId;
  const inputPw = req.body.inputPw;
  const inputName = req.body.inputName;

  const sql =
    "INSERT INTO Login (user_id, user_password,user_name, user_type) VALUES (?,?,?,'mentee');";
  db.query(sql, [inputId, inputPw, inputName], (err, result) => {
    if (err) {
      res.send({ err_message: "Insert 오류" });
    } else {
      res.send(result);
    }
  });
});

// 회원가입 이메일 중복체크
app.post("/api/register/duplication_check", (req, res) => {
  const inputId = req.body.inputId;

  const sql = "SELECT * FROM Login WHERE user_id = ?;";
  db.query(sql, inputId, (err, result) => {
    res.send(result);
  });
});

// 회원가입 이메일 인증
app.post("/api/register/nodemailer", (req, res) => {
  const inputId = req.body.inputId;
  const authNum = Math.random().toString().substr(2, 6);

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "jongmin@spreneur.kr",
      pass: "jay8582$",
    },
  });

  var mailOptions = {
    from: "jongmin@spreneur.kr",
    to: inputId,
    subject: "EXEC 회원가입 인증번호",
    text: `인증번호: ${authNum}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      req.session.authCode = authNum;
      res.send({ sendMail: true, authCode: authNum });
    }
  });
});

// 로그인하기
app.post("/api/login", (req, res) => {
  const inputId = req.body.inputId;
  const inputPw = req.body.inputPw;

  const sql = "SELECT * FROM Login WHERE user_id = ?;";
  db.query(sql, inputId, (err, result) => {
    if (err) {
      res.send({ err: err });
    }

    if (result.length > 0) {
      if (inputPw === result[0].user_password) {
        req.session.user = result[0];
        res.send(result);
      } else {
        res.send({ errMessage: "잘못된비밀번호입니다" });
      }
    } else {
      res.send({ errMessage: "잘못된 아이디입니다." });
    }
  });
});
// 로그인 확인
app.get("/api/login", (req, res) => {
  console.log("Login", req.session.user);
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

//로그아웃 하기
app.post("/logout", (req, res) => {
  console.log("logout");
  req.session.destroy((err) => {
    if (err) {
      console.log("logout failed");
    } else {
      res.redirect("/login");
    }
  });
});


//이미지 업로드
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(req.params.userId);
    const path = `./images/temp/${req.params.userId}`;
    !fs.existsSync(path) &&
      fs.mkdirSync(path, (err) => {
        // (3)
        if (err) cb(err);
      });
    cb(null, `images/temp/${req.params.userId}`);
  },
  filename: (req, file, cb) => {
    cb(null, `${uuid()}.${mime.extension(file.mimetype)}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (["image/jpeg", "image/jpg", "image/png"].includes(file.mimetype))
      cb(null, true);
    else cb(new Error("해당 파일의 형식을 지원하지 않습니다."), false);
  },
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

app.post("/api/upload/:userId", upload.single("file"), (req, res) => {
  console.log("IMG");
  res.status(200).json(req.file);
});

app.use("/images", express.static(path.join(__dirname, "/images")));

function getImageFileNames(content) {
  const imgTags = content.match(/<img[^>]+src=["']([^"']+)["']/g);
  if (!imgTags) return [];

  return imgTags.map((imgTag) => {
    const src = imgTag.match(/src=["']([^"']+)["']/);
    return src[1];
  });
}

//임시로 올린 사진 삭제
app.post("/api/temp_delete/:userId", (req, res) => {
  const path = `./images/temp/${req.params.userId}`;
  try {
    console.log("디렉토리 삭제");
    fs.existsSync(path) && fs.removeSync(path); // (1)
    res.status(200).json("디렉토리를 성공적으로 삭제하였습니다.");
  } catch (err) {
    throw new Error(err.message);
  }
});

//새로운 업무 등록
app.post("/new_BQ", async (req, res) => {
  const title = req.body.title;
  let content = req.body.content;
  const input_time = req.body.input_time;
  const userId = req.body.userId;
  const userName = req.body.userName;
  const solved =false;

  const imageFileNames = getImageFileNames(content);
  const promises = [];
  imageFileNames.forEach((fileName) => {
    const url = require("url");
    const urlObject = url.parse(fileName);
    const filePath = path.join(__dirname, urlObject.pathname);
    promises.push(
      new Promise((resolve, reject) => {
        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.log("fs.stat", err);
          } else {
            const tempFilePath = filePath;
            const postFilePath = path.join(
              __dirname,
              "/images/post",
              path.basename(tempFilePath)
            );
            fs.rename(tempFilePath, postFilePath, (err) => {
              if (err) {
                console.error(`Error moving file: ${err}`);
                reject(err);
              }
              console.log(`${tempFilePath} was moved to ${postFilePath}`);
              content = content.replace(
                urlObject.pathname,
                "/images/post/" + path.basename(postFilePath)
              );
              resolve();
            });
          }
        });
      })
    );
  });
  try {
    await Promise.all(promises);
  } catch (err) {
    return res.send({ errMessage: "Error moving files", err: err });
  }

  const sql =
    "INSERT INTO BQ (Title, Content, Input_time,userId,solved,userName) VALUES (?,?,?,?,?,?);";
  db.query(sql, [title, content, input_time,userId,solved,userName], (err, result) => {
    if (err) {
      res.send({ errMessage: "등록에 실패하였습니다", err: err });
    } else {
      res.send("새로운 업무가 등록되었습니다");
    }
  });
});

//get_BQ_list
app.get("/get_unsolved_BQ_list", (req, res) => {
  const userId = req.query.userId;
  const solved = false;
  const sql = "SELECT Title, Input_time,userName FROM BQ WHERE userId = ? AND solved = ?;";
  db.query(sql, [userId,solved], (err, result) => {
    if (err) {
      res.send({ errMessage: "미션을 불러오지 못 했습니다", err: err });
    } else {
      res.send(result);
    }
  });
});
app.get("/get_unsolved_BQ_list_mentor", (req, res) => {
  const userId = req.query.userId;
  const solved = false;
  const sql = "SELECT Title, Input_time,userName,userId FROM BQ WHERE mentorCheck = ?;";
  db.query(sql, [solved], (err, result) => {
    if (err) {
      res.send({ errMessage: "미션을 불러오지 못 했습니다", err: err });
    } else {
      res.send(result);
    }
  });
});
app.get("/get_solved_BQ_list", (req, res) => {
  const userId = req.query.userId;
  const solved = true;
  const sql = "SELECT Title, Input_time,UserName FROM BQ WHERE userId = ? AND solved = ?;";
  db.query(sql, [userId,solved], (err, result) => {
    if (err) {
      res.send({ errMessage: "미션을 불러오지 못 했습니다", err: err });
    } else {
      res.send(result);
    }
  });
});
app.get("/get_solved_BQ_list_mentor", (req, res) => {
  const userId = req.query.userId;
  const solved = true;
  const sql = "SELECT Title, Input_time,userName,userId FROM BQ WHERE mentorCheck = ?;";
  db.query(sql, [solved], (err, result) => {
    if (err) {
      res.send({ errMessage: "미션을 불러오지 못 했습니다", err: err });
    } else {
      res.send(result);
    }
  });
});
//get_BQ_detail
app.post("/get_BQ_detail", (req, res) => {
  const userId = req.body.userId;
  const Input_time = req.body.Input_time;
  const sql = "SELECT * FROM BQ WHERE userId = ? AND Input_time = ?;";
  db.query(sql, [userId,Input_time], (err, result) => {
    if (err) {
      res.send({ errMessage: "불러오지 못 했습니다", err: err });
    } else {
      res.send(result);
    }
  });
});

app.post("/get_BA_list", (req, res) => {
  const userId = req.body.userId;
  const BQ = req.body.BQ;
  const sql = "SELECT * FROM BA WHERE userId = ? AND BQ = ?;";
  db.query(sql, [userId,BQ], (err, result) => {
    if (err) {
      res.send({ errMessage: "불러오지 못 했습니다", err: err });
    } else {
      res.send(result);
    }
  });
});
app.post("/BQ_get_solved", (req, res) => {
  const userId = req.body.userId;
  const BQ = req.body.BQ;
  const solved = true;
  const sql = "UPDATE BQ SET solved = ? WHERE Input_time =? AND userID = ?;";
  db.query(sql, [solved, BQ,userId], (err, result) => {
    if (err) {
      res.send({ errMessage: "불러오지 못 했습니다", err: err });
    } else {
      res.send("완료되었습니다");
    }
  });
});
app.post("/BQ_get_mentorCheck", (req, res) => {
  const userId = req.body.userId;
  const BQ = req.body.BQ;
  const mentorCheck = true;
  const sql = "UPDATE BQ SET mentorCheck = ? WHERE Input_time =? AND userID = ?;";
  db.query(sql, [mentorCheck, BQ,userId], (err, result) => {
    if (err) {
      res.send({ errMessage: "불러오지 못 했습니다", err: err });
    } else {
      res.send("완료되었습니다");
    }
  });
});
app.post("/BQ_delete", (req, res) => {
  const userId = req.body.userId;
  const BQ = req.body.BQ;
  const sql = "DELETE FROM BQ WHERE Input_time = ? AND userId = ?";
  db.query(sql, [BQ,userId], (err, result) => {
    if (err) {
      res.send({ errMessage: "불러오지 못 했습니다", err: err });
    } else {
      const sql2 = "DELETE FROM BA WHERE BQ = ? AND userId = ?";
      db.query(sql2, [BQ,userId], (err, result) => {
        if (err) {
          res.send({ errMessage: "불러오지 못 했습니다", err: err });
        } else {
          res.send("삭제되었습니다");
        }
      });
    }
  });

  




});

//댓글 달기
app.post("/BQ_reply", async (req, res) => {

  const content = req.body.content;
  const input_time = req.body.input_time;
  const userId = req.body.userId;
  const BQ = req.body.BQ;
  const commenterName = req.session.user.user_name;
  const commenterId = req.session.user.user_id;
  const mentorCheck = false;


   const sql =
    "INSERT INTO BA (Content, Input_time,userId,BQ,commenterName,commenterId) VALUES (?,?,?,?,?,?);";
  db.query(sql, [content, input_time,userId,BQ,commenterName,commenterId], (err, result) => {
    if (err) {
      res.send({ errMessage: "등록에 실패하였습니다", err: err });
    } else {
      const sql2 =
      "UPDATE BQ SET mentorCheck = ? WHERE Input_time =? AND userID = ?;";
    db.query(sql2, [mentorCheck,BQ,userId], (err, result) => {
      if (err) {
        console.log("mentorCheck err",err);
      } else {
        console.log("mentorCheck")
      }
    });
      res.send("댓글이 등록되었습니다");
    }
  });

});
app.post("/BQ_reply_mentor", async (req, res) => {

  const content = req.body.content;
  const input_time = req.body.input_time;
  const userId = req.body.userId;
  const BQ = req.body.BQ;
  const commenterName = req.session.user.user_name;
  const commenterId = req.session.user.user_id;


   const sql =
    "INSERT INTO BA (Content, Input_time,userId,BQ,commenterName,commenterId) VALUES (?,?,?,?,?,?);";
  db.query(sql, [content, input_time,userId,BQ,commenterName,commenterId], (err, result) => {
    if (err) {
      res.send({ errMessage: "등록에 실패하였습니다", err: err });
    } else {
      res.send("댓글이 등록되었습니다");
    }
  });

});

app.post("/delete_reply", (req, res) => {
  const userId = req.body.userId;
  const BQ = req.body.BQ;
  const Input_time = req.body.Input_time;
  const sql = "DELETE FROM BA WHERE Input_time = ? AND userId = ? AND BQ = ?";
  db.query(sql, [Input_time,userId,BQ], (err, result) => {
    if (err) {
      res.send({ errMessage: "불러오지 못 했습니다", err: err });
    } else {
      res.send("삭제되었습니다");
    }
  });
});

//orgChart

app.get("/org_chart", (req, res) => {
  const userId = req.query.userId;

  const sql = "SELECT * FROM OrgChart WHERE userId = ? ORDER BY Date DESC;";
  db.query(sql, [userId], (err, result) => {
    if (err) {
      res.send({ errMessage: "조직도을 불러오지 못 했습니다", err: err });
    } else {
      res.send(result);
    }
  });
});
app.get("/recent_org_chart", (req, res) => {
  const userId = req.query.userId;

  const sql =
    "SELECT * FROM OrgChart WHERE userId = ? ORDER BY Date DESC Limit 1;";
  db.query(sql, [userId], (err, result) => {
    if (err) {
      res.send({ errMessage: "조직도을 불러오지 못 했습니다", err: err });
    } else {
      res.send(result);
    }
  });
});
app.get("/org_chart", (req, res) => {
  const userId = req.query.userId;

  const sql = "SELECT * FROM OrgChart WHERE userId = ? ORDER BY Date DESC;";
  db.query(sql, [userId], (err, result) => {
    if (err) {
      res.send({ errMessage: "조직도을 불러오지 못 했습니다", err: err });
    } else {
      res.send(result);
    }
  });
});

app.post("/org_chart_date_change", (req, res) => {
  const date = req.body.date;
  const userId = req.body.userId;

  if (date === "new") {
    const sql =
      "SELECT * FROM OrgChart WHERE userId = ? ORDER BY Date DESC LIMIT 1;";
    db.query(sql, [userId], (err, result) => {
      if (err) {
        res.send({ errMessage: "조직도을 불러오지 못 했습니다", err: err });
      } else {
        res.send(result);
      }
    });
  } else {
    const sql = "SELECT * FROM OrgChart WHERE userId = ? AND Date = ?;";
    db.query(sql, [userId, date], (err, result) => {
      console.log("result", result);
      if (err) {
        res.send({ errMessage: "조직도을 불러오지 못 했습니다", err: err });
      } else {
        res.send(result);
      }
    });
  }
});

app.get("/org_chart_list", (req, res) => {
  const userId = req.query.userId;

  const sql = "SELECT Date FROM OrgChart WHERE userId = ? ORDER BY Date DESC;";
  db.query(sql, [userId], (err, result) => {
    if (err) {
      res.send({ errMessage: "조직도 날짜를 불러오지 못 했습니다", err: err });
    } else {
      res.send(result);
    }
  });
});

app.post("/new_orgChart", (req, res) => {
  const TreeData = req.body.treeData;
  const Date = req.body.Date;
  const userId = req.body.userId;
  const Title = req.body.Title;

  const sql =
    "INSERT INTO OrgChart (Date, TreeData, userId,Title) VALUES (?,?,?,?);";
  db.query(sql, [Date, TreeData, userId, Title], (err, result) => {
    if (err) {
      res.send("저장되지 않았습니다");
    } else {
      res.send("저장되었습니다");
    }
  });
});

app.post("/edit_orgChart", (req, res) => {
  const TreeData = req.body.treeData;
  const Date = req.body.Date;
  const userId = req.body.userId;
  const Title = req.body.Title;

  const sql =
    "UPDATE OrgChart SET TreeData = ?, Title = ? WHERE userId =? AND Date = ?;";
  db.query(sql, [TreeData, Title, userId, Date], (err, result) => {
    if (err) {
      res.send("수정되지 않았습니다");
    } else {
      res.send("수정되었습니다");
    }
  });
});

app.post("/delete_orgChart", (req, res) => {
  const Date = req.body.Date;
  const userId = req.body.userId;

  const sql = "DELETE FROM OrgChart WHERE Date = ? AND userId = ?";
  db.query(sql, [Date, userId], (err, result) => {
    if (err) {
      console.log("errrr", err);
      res.send("삭제되지 않았습니다");
    } else {
      res.send("삭제되었습니다");
    }
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log("running on potor", PORT);
});
