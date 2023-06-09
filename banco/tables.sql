CREATE TABLE IF NOT EXISTS User(
    userId BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(20) NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(80) NOT NULL,
    name VARCHAR(20) NOT NULL,
    lastName VARCHAR(20) NOT NULL,
    selectedAvatar INT,
    isValidatedEmail BOOLEAN NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_username (username)
);

CREATE TABLE IF NOT EXISTS UserFinances (
    userId BIGINT NOT NULL PRIMARY KEY,
    balance DECIMAL(15,2) DEFAULT 0,
    totalSavings DECIMAL(15,2) DEFAULT 0,
    currentSavings DECIMAL(15,2) DEFAULT 0,
    FOREIGN KEY (userId) REFERENCES User(userId)
);

CREATE TABLE IF NOT EXISTS UserLevel (
    userId BIGINT NOT NULL PRIMARY KEY,
    currentLevel SMALLINT NOT NULL DEFAULT 1,
    currentXp INT NOT NULL DEFAULT 0,
    points INT NOT NULL DEFAULT 0,
    FOREIGN KEY (userId) REFERENCES User(userId)
);

CREATE TABLE IF NOT EXISTS UserActivity (
    activityId BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    userId BIGINT NOT NULL,
    description TEXT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(userId)
);

CREATE TABLE IF NOT EXISTS Medals (
    medalId TINYINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(40) NOT NULL,
    filename VARCHAR(40) NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS UserMedals (
    userId BIGINT NOT NULL,
    medalId TINYINT NOT NULL,
    earnedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(userId),
    FOREIGN KEY (medalId) REFERENCES Medals(medalId)
);

CREATE TABLE IF NOT EXISTS Achievements (
    achievementId SMALLINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    typeId TINYINT NOT NULL,
    name VARCHAR(40) NOT NULL,
    description VARCHAR(40) NOT NULL,
    xpReward INT NOT NULL DEFAULT 0,
    pointReward TINYINT NOT NULL DEFAULT 0,
    medalReward TINYINT,
    goal INT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (medalReward) REFERENCES Medals (medalId)
);

CREATE TABLE IF NOT EXISTS UserAchievements(
    userId BIGINT NOT NULL,
    achievementId SMALLINT NOT NULL,
    earnedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(userId),
    FOREIGN KEY (achievementId) REFERENCES Achievements(achievementId)
);

CREATE TABLE IF NOT EXISTS UserBills (
    billId BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    userId BIGINT NOT NULL,
    typeId VARCHAR(1) NOT NULL,
    category VARCHAR(2) NOT NULL,
    description VARCHAR(40) NOT NULL,
    installmentValue DECIMAL(15,2) NOT NULL,
    paymentDay TINYINT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    isCanceled BOOLEAN NOT NULL,
    canceledAt DATETIME,
    FOREIGN KEY (userId) REFERENCES User(userId),
    KEY idx_typeId (typeId)
);


CREATE TABLE IF NOT EXISTS BillInstallments (
    installmentId BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    billId BIGINT NOT NULL,
    installmentNumber INT NOT NULL,
    value DECIMAL(15,2) NOT NULL,
    dueDate DATE NOT NULL,
    isPayed BOOLEAN NOT NULL DEFAULT 0,
    payedAt DATETIME,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (billId) REFERENCES UserBills(billId)
);

CREATE TABLE IF NOT EXISTS UserGoals (
    goalId BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    userId BIGINT NOT NULL,
    description VARCHAR(40) NOT NULL,
    value DECIMAL(15,2) NOT NULL,
    progressValue DECIMAL(15,2) NOT NULL DEFAULT 0,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    isCanceled BOOLEAN NOT NULL DEFAULT 0,
    canceledAt DATETIME,
    isCompleted BOOLEAN NOT NULL DEFAULT 0,
    completedAt DATETIME,
    FOREIGN KEY (userId) REFERENCES User(userId)
);

CREATE TABLE IF NOT EXISTS Avatar (
    avatarId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(10) NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS UserAvatars (
    avatarId INT NOT NULL,
    userId BIGINT NOT NULL,
    earnedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (avatarId) REFERENCES Avatar(avatarId),
    FOREIGN KEY (userId) REFERENCES User(userId)
);

CREATE TABLE IF NOT EXISTS UserEarnings (
    earningId BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    userId BIGINT NOT NULL,
    description VARCHAR(40) NOT NULL,
    category VARCHAR(2) NOT NULL,
    value DECIMAL(15,2) NOT NULL,
    earnedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    isCanceled BOOLEAN NOT NULL DEFAULT 0,
    canceledAt DATETIME,
    FOREIGN KEY (userId) REFERENCES User(userId)
);

CREATE TABLE IF NOT EXISTS UserSpendings (
    spendingId BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    userId BIGINT NOT NULL,
    description VARCHAR(40) NOT NULL,
    category VARCHAR(2) NOT NULL,
    value DECIMAL(15,2) NOT NULL,
    spentAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    isCanceled BOOLEAN NOT NULL DEFAULT 0,
    canceledAt DATETIME,
    FOREIGN KEY (userId) REFERENCES User(userId)
);

CREATE TABLE IF NOT EXISTS UserLogin (
    userId BIGINT NOT NULL,
    loginAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(userId)
);

CREATE TABLE IF NOT EXISTS UserEmailCodes (
    userId BIGINT NOT NULL,
    code VARCHAR(5) NOT NULL,
    sentAt DATETIME NOT NULL,
    FOREIGN KEY (userId) REFERENCES User(userId)
);
