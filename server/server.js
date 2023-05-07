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
const bcrypt = require("bcryptjs");
const saltRounds = 10;
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

// 회원가입
app.post("/api/register", (req, res) => {
  const inputId = req.body.inputId;
  const inputPw = req.body.inputPw;
  const inputName = req.body.inputName;

  bcrypt.hash(inputPw, saltRounds, (err, hash) => {
    if (err) {
      res.send({ err_message: "bcrypt 오류" });
    }

    const sql =
      "INSERT INTO Login (user_id, user_password,user_name, user_type) VALUES (?,?,?,'mentee');";
    db.query(sql, [inputId, hash, inputName], (err, result) => {
      if (err) {
        res.send({ err_message: "Insert 오류" });
      } else {
        res.send(result);
      }
    });
  });
});
app.post("/api/register/duplication_check", (req, res) => {
  const inputId = req.body.inputId;

  const sql = "SELECT * FROM Login WHERE user_id = ?;";
  db.query(sql, inputId, (err, result) => {
    res.send(result);
  });
});
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

// 로그인
app.post("/api/login", (req, res) => {
  const inputId = req.body.inputId;
  const inputPw = req.body.inputPw;

  const sql = "SELECT * FROM Login WHERE user_id = ?;";
  db.query(sql, inputId, (err, result) => {
    if (err) {
      res.send({ err: err });
    }

    if (result.length > 0) {
      bcrypt.compare(inputPw, result[0].user_password, (error, response) => {
        if (response) {
          req.session.user = result[0];
          res.send(result);
        } else {
          res.send({ errMessage: "잘못된비밀번호입니다" });
        }
      });
    } else {
      res.send({ errMessage: "잘못된 아이디입니다." });
    }
  });
});

app.get("/api/login", (req, res) => {
  console.log("Login", req.session.user);
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

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

//Google
app.post("/login", (req, res) => {
  const email = req.body.email;
  const user_name = req.body.user_name;
  const picture = req.body.picture;

  const sql = "SELECT * FROM Member WHERE Email = ?;";
  db.query(sql, email, (err, result) => {
    if (err) {
      res.send({ err_message: "Member DB 오류", err: err });
    }

    if (result.length > 0) {
      const type = result[0].Type;
      console.log(" existing MEMBER");
      const user = {
        email: email,
        user_name: user_name,
        picture: picture,
        type: type,
      };
      req.session.user = user;
      res.send(user);
    } else {
      console.log("NEW MEMBER");
      const user = {
        email: email,
        user_name: user_name,
        picture: picture,
        type: "mentee",
      };
      req.session.user = user;
      const sql =
        "INSERT INTO Member (Email, User_name,Picture,Type) VALUES (?,?,?,'mentee');";
      db.query(sql, [email, user_name, picture], (err, result) => {
        if (err) {
          res.send({ err_message: "Insert 오류", err: err });
        } else {
          res.send("새로운 멤버 등록 완료");
        }
      });
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

//NEW MISSION
function getImageFileNames(content) {
  const imgTags = content.match(/<img[^>]+src=["']([^"']+)["']/g);
  if (!imgTags) return [];

  return imgTags.map((imgTag) => {
    const src = imgTag.match(/src=["']([^"']+)["']/);
    return src[1];
  });
}

app.post("/new_mission", async (req, res) => {
  const title = req.body.title;
  let content = req.body.content;
  const input_time = req.body.input_time;

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
    "INSERT INTO Mission (Title, Content, Input_time) VALUES (?,?,?);";
  db.query(sql, [title, content, input_time], (err, result) => {
    if (err) {
      res.send({ errMessage: "등록에 실패하였습니다", err: err });
    } else {
      const sql =
        "UPDATE Login SET next_mission = ? WHERE next_mission ='No More';";
      db.query(sql, [input_time], (err, result) => {
        if (err) {
          res.send({ err_message: "UPdate 오류" });
        } else {
          res.send("새로운 미션이 등록되었습니다");
        }
      });
    }
  });
});

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

//delete mission
const deleteFile = (fileName) => {
  const url = require("url");
  const urlObject = url.parse(fileName);
  const filePath = path.join(__dirname, urlObject.pathname);
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

app.post("/delete_mission", async (req, res) => {
  const input_time = req.body.input_time;
  let content = req.body.content;
  const imageFileNames = getImageFileNames(content);

  try {
    await Promise.all(imageFileNames.map((fileName) => deleteFile(fileName)));
    console.log("All files deleted successfully");
  } catch (err) {
    console.error(`Error deleting files: ${err}`);
  }
  const sql = "DELETE FROM Mission WHERE Input_time = ?";
  db.query(sql, input_time, (err, result) => {
    if (err) {
      res.send({ errMessage: "삭제 중 오류가 발생했습니다", err: err });
    } else {
      res.send("삭제하였습니다");
    }
  });
});

//edit mission
const cheerio = require("cheerio");

const findMissingImgSrc = (content, originContent) => {
  console.log("fmfm", typeof content);
  const $content = cheerio.load(content);
  const $originContent = cheerio.load(originContent);

  const missingImgSrcs = [];
  $originContent("img").each((index, element) => {
    const originSrc = $originContent(element).attr("src");
    if ($content(`img[src="${originSrc}"]`).length === 0) {
      missingImgSrcs.push(originSrc);
    }
  });
  return missingImgSrcs;
};

app.post("/edit_mission", async (req, res) => {
  const title = req.body.title;
  const originContent = req.body.originContent;
  let content = req.body.content;
  const input_time = req.body.input_time;

  const missing = findMissingImgSrc(content, originContent);
  console.log("missing", missing);
  missing.forEach((fileName) => deleteFile(fileName));

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
            if (err.code === "ENOENT") {
              console.log(
                "Error: " + err.code + " - " + filePath + " does not exist."
              );
              resolve();
            } else {
              console.log("fs.stat", err);
              reject(err);
            }
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

  const sql = "UPDATE Mission SET Title = ?, Content = ? WHERE Input_time =?;";
  db.query(sql, [title, content, input_time], (err, result) => {
    if (err) {
      res.send({ errMessage: "수정에 실패하였습니다", err: err });
    } else {
      res.send("수정 성공");
    }
  });
});

//get mission
app.get("/get_mission", (req, res) => {
  const input_time = req.query.input_time;

  const sql = "SELECT * FROM Mission WHERE Input_time = ?;";
  db.query(sql, input_time, (err, result) => {
    if (err) {
      res.send({ errMessage: "미션을 불러오지 못 했습니다", err: err });
    } else {
      res.send(result);
    }
  });
});

//mission list
app.get("/mission_list_done", (req, res) => {
  const userId = req.session.user.user_id;

  const sql =
    "SELECT * FROM Mission WHERE input_time IN (SELECT missionKey FROM Complete where userId = ?);";
  db.query(sql, userId, (err, result) => {
    if (err) {
      res.send({ errMessage: "미션을 불러오지 못 했습니다", err: err });
    } else {
      res.send(result);
    }
  });
});

app.get("/mission_list_every", (req, res) => {
  const userId = req.session.user.user_id;

  const sql = "SELECT * FROM Mission ORDER BY Input_time;";

  db.query(sql, userId, (err, result) => {
    if (err) {
      res.send({ errMessage: "미션을 불러오지 못 했습니다", err: err });
    } else {
      res.send(result);
    }
  });
});

app.get("/mission_list_new", (req, res) => {
  const next_mission = req.session.user.next_mission;
  const completeTime = new Date(req.session.user.complete_time);
  const currentTime = new Date();
  const completeDate = new Date(
    completeTime.getFullYear(),
    completeTime.getMonth(),
    completeTime.getDate()
  );
  const currentDate = new Date(
    currentTime.getFullYear(),
    currentTime.getMonth(),
    currentTime.getDate()
  );

  if (next_mission) {
    if (next_mission === "No More") {
      //미션 다 완료
      res.send(false);
    }
    if (currentDate > completeDate) {
      //하루지남
      const sql = "SELECT * FROM Mission WHERE input_time = ?;";
      db.query(sql, next_mission, (err, result) => {
        if (err) {
          res.send({ errMessage: "미션을 불러오지 못 했습니다", err: err });
        } else {
          res.send({ result: result });
        }
      });
    } else {
      //하루 안 지남

      res.send(false);
    }
  } else {
    // 첫 미션
    const sql = "SELECT * FROM Mission ORDER BY Input_time Limit 1;";
    db.query(sql, (err, result) => {
      if (err) {
        res.send({ errMessage: "미션을 불러오지 못 했습니다", err: err });
      } else {
        res.send({ result: result, first: "first" });
      }
    });
  }
});

//completed mission 완료된 미션
app.get("/completed_mission", (req, res) => {
  const input_time = req.query.input_time;
  const userId = req.session.user.user_id;

  const sql = "SELECT * FROM Complete WHERE missionKey = ? AND userId = ?;";
  db.query(sql, [input_time, userId], (err, result) => {
    if (err) {
      res.send({ errMessage: "completed mission err", err: err });
    }
    if (result.length > 0) {
      res.send(true);
    } else {
      res.send(false);
    }
  });
});

//complete mission
app.post("/complete_mission", (req, res) => {
  const missionKey = req.body.missionKey;
  const userId = req.body.userId;
  const complete_date = req.body.complete_date;

  const sql = "INSERT INTO Complete (userId, missionKey) VALUES (?,?);";
  db.query(sql, [userId, missionKey], (err, result) => {
    if (err) {
      res.send({ err_message: "Insert 오류" });
    } else {
      const sql2 =
        "SELECT Input_time FROM Mission WHERE Input_time > ? ORDER BY Input_time LIMIT 1;";
      db.query(sql2, [missionKey], (err, result) => {
        if (err) {
          console.log("finding next mission err");
        } else if (result.length > 0) {
          const next_mission = result[0].Input_time;
          console.log("next missionKey:", next_mission);
          const sql3 =
            "UPDATE Login SET next_mission = ?, complete_time = ? WHERE user_id =?;";
          console.log("complete_date", complete_date);
          db.query(
            sql3,
            [next_mission, complete_date, userId],
            (err, result) => {
              if (err) {
                res.send({ err_message: "UPdate 오류" });
              } else {
                req.session.user.next_mission = next_mission;
                req.session.user.complete_time = complete_date;
                res.send("미션이 완료되었습니다");
              }
            }
          );
        } else {
          const next_mission = "No More";
          const sql3 =
            "UPDATE Login SET next_mission = ?, complete_time = ? WHERE user_id =?;";
          db.query(
            sql3,
            [next_mission, complete_date, userId],
            (err, result) => {
              if (err) {
                res.send({ err_message: "UPdate 오류" });
              } else {
                req.session.user.next_mission = next_mission;
                req.session.user.complete_date = complete_date;
                res.send("미션이 완료되었습니다");
              }
            }
          );
        }
      });
    }
  });
});

//MEMO
app.post("/save_memo", (req, res) => {
  const memo = req.body.memo;
  const missionKey = req.body.missionKey;
  const userId = req.body.userId;

  const sql = "SELECT * FROM Memo WHERE MissionKey = ? AND UserId = ?;";
  db.query(sql, [missionKey, userId], (err, result) => {
    if (err) {
      res.send({ errMessage: "오류가 발생했습니다", err: err });
    } else if (result.length > 0) {
      const sql =
        "UPDATE Memo SET Memo = ? WHERE MissionKey = ? AND UserId = ?;";
      db.query(sql, [memo, missionKey, userId], (err, result) => {
        if (err) {
          res.send({ errMessage: "메모 수정에 실패하였습니다", err: err });
        } else {
          res.send("메모가 저장되었습니다");
        }
      });
    } else {
      const sql = "INSERT INTO Memo (UserId,Memo,MissionKey) VALUES (?,?,?);";
      db.query(sql, [userId, memo, missionKey], (err, result) => {
        if (err) {
          res.send({ err_message: "메모 Insert 오류", err: err });
        } else {
          res.send("메모가 저장되었습니다");
        }
      });
    }
  });
});

app.get("/get_memo", (req, res) => {
  const input_time = req.query.missionKey;
  const userId = req.query.userId;

  const sql = "SELECT * FROM Memo WHERE MissionKey = ? AND UserId = ?;";
  db.query(sql, [input_time, userId], (err, result) => {
    if (err) {
      res.send({ errMessage: "메모를 불러오지 못했습니다", err: err });
    } else {
      res.send(result);
    }
  });
});

//WAITING
app.get("/waiting", (req, res) => {
  const next_mission = req.session.user.next_mission;
  const completeTime = new Date(req.session.user.complete_time);
  const completeDate = new Date(
    completeTime.getFullYear(),
    completeTime.getMonth(),
    completeTime.getDate()
  );
  const currentTime = new Date();
  const currentDate = new Date(
    currentTime.getFullYear(),
    currentTime.getMonth(),
    currentTime.getDate()
  );
  const nextDay = new Date(currentDate.getTime() + 86400000);
  const year = nextDay.getFullYear();
  const month = nextDay.getMonth() + 1;
  const date = nextDay.getDate();

  if (next_mission === "No More") {
    res.send("다음 미션을 준비 중입니다.");
  }
  if (currentDate <= completeDate) {
    res.send(`${year}년 ${month}월 ${date}일 에 새로운 미션이 공개됩니다.`);
  } else {
    res.send(
      "새로운 미션을 가져오는 데 오류가 발생했습니다. 오류가 반복되면 문의해 주세요"
    );
  }
});

//orgChart

app.get("/org_chart", (req, res) => {
  const userId = req.query.userId;

  const sql =
    "SELECT * FROM OrgChart WHERE userId = ? ORDER BY Date DESC;";
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

  const sql =
    "SELECT * FROM OrgChart WHERE userId = ? ORDER BY Date DESC;";
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

  const sql = "INSERT INTO OrgChart (Date, TreeData, userId,Title) VALUES (?,?,?,?);";
  db.query(sql, [Date, TreeData, userId,Title], (err, result) => {
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

  const sql = "UPDATE OrgChart SET TreeData = ?, Title = ? WHERE userId =? AND Date = ?;";
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
  db.query(sql, [Date,userId], (err, result) => {
    if (err) {
      console.log("errrr",err);
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
