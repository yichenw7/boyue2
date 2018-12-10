/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50717
Source Host           : localhost:3306
Source Database       : multisdkself

Target Server Type    : MYSQL
Target Server Version : 50717
File Encoding         : 65001

Date: 2017-05-04 11:35:06
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for channels
-- ----------------------------
DROP TABLE IF EXISTS `channels`;
CREATE TABLE `channels` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cname` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `codes` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cnum` int(11) DEFAULT NULL,
  `locations` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of channels
-- ----------------------------
INSERT INTO `channels` VALUES ('1', '豌豆荚', 'wdj', '220', '0');
INSERT INTO `channels` VALUES ('2', '点点乐', 'ddl', '200', '0');

-- ----------------------------
-- Table structure for games
-- ----------------------------
DROP TABLE IF EXISTS `games`;
CREATE TABLE `games` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gname` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `gcode` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `describes` varchar(2000) COLLATE utf8_unicode_ci DEFAULT NULL,
  `appid` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `appkey` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `icon` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of games
-- ----------------------------
INSERT INTO `games` VALUES ('1', '梦幻天团', 'mh', '1111', '800000003', 'fc3f96389388e8eb72fcf0bd028cc6c5', 'http://oo0zxd3f1.bkt.clouddn.com/icon.png');
INSERT INTO `games` VALUES ('2', '极品飞车', 'efans', '111', '800000008', '1234', 'http://oo0zxd3f1.bkt.clouddn.com/icon.png');
INSERT INTO `games` VALUES ('53', '23424', '23424', '24342', '800000009', '1f388b288f95ed81e87aa0e5a5515170', 'http://oo0zxd3f1.bkt.clouddn.com/o_1bdlo6l7u1s56u78e057rq1onds.png');
INSERT INTO `games` VALUES ('54', '55', '666', '555', '800000010', 'cee94eb11e53d4b76371ab3b9dbb4364', 'http://oo0zxd3f1.bkt.clouddn.com/o_1bdlo70f5f8okk1180o1urkstv18.png');
INSERT INTO `games` VALUES ('55', '111', '111', '1111', '800000011', 'e11170b8cbd2d74102651cb967fa28e5', 'http://oo0zxd3f1.bkt.clouddn.com/o_1bdlpcrv18cl46hals1u3epmg9.png');
INSERT INTO `games` VALUES ('56', '222', '33', '3333', '800000012', '0ddd47c6ba54c4c4202ec0acd0526a98', 'http://oo0zxd3f1.bkt.clouddn.com/o_1bdlqh2fl19cimoh86e1acb100p9.png');
INSERT INTO `games` VALUES ('57', '1231312', '213121312', '13123', '800000013', '8c7e5cabdce6958b7d11e5d1668f2168', 'http://oo0zxd3f1.bkt.clouddn.com/o_1bdlt0fb61mq6qb5cc24om15n89.png');
INSERT INTO `games` VALUES ('58', 'dfds', '123', '123123', '800000014', '2a9db4c1bfd47741a7717a73dcd67ee0', 'http://oo0zxd3f1.bkt.clouddn.com/o_1bdvscbom1hbb1g9qro7ud1o9o9.png');

-- ----------------------------
-- Table structure for game_channel
-- ----------------------------
DROP TABLE IF EXISTS `game_channel`;
CREATE TABLE `game_channel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_id` int(11) NOT NULL,
  `channel_id` int(11) NOT NULL,
  `pay_notice_url` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `package_name` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `locations` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of game_channel
-- ----------------------------
INSERT INTO `game_channel` VALUES ('1', '1', '1', 'http://pay.multisdk.com/8000000001/v1/wdj', 'com.ddl.idolgame.wdj', '0');
INSERT INTO `game_channel` VALUES ('2', '2', '2', 'http://pay.multisdk.com/8000000001/v1/ddl', 'com.ddl.idolgame.ddl', '0');
INSERT INTO `game_channel` VALUES ('58', '53', '1', 'http://pay.multisdk.com/800000009/v1/wdj', 'com.ddl.23424.wdj', '0');
INSERT INTO `game_channel` VALUES ('59', '53', '2', 'http://pay.multisdk.com/800000009/v1/ddl', 'com.ddl.23424.ddl', '0');
INSERT INTO `game_channel` VALUES ('61', '54', '1', 'http://pay.multisdk.com/800000010/v1/wdj', 'com.ddl.666.wdj', '0');
INSERT INTO `game_channel` VALUES ('62', '54', '2', 'http://pay.multisdk.com/800000010/v1/ddl', 'com.ddl.666.ddl', '0');
INSERT INTO `game_channel` VALUES ('64', '55', '1', 'http://pay.multisdk.com/800000011/v1/wdj', 'com.ddl.111.wdj', '0');
INSERT INTO `game_channel` VALUES ('65', '55', '2', 'http://pay.multisdk.com/800000011/v1/ddl', 'com.ddl.111.ddl', '0');
INSERT INTO `game_channel` VALUES ('67', '56', '1', 'http://pay.multisdk.com/800000012/v1/wdj', 'com.ddl.33.wdj', '0');
INSERT INTO `game_channel` VALUES ('68', '56', '2', 'http://pay.multisdk.com/800000012/v1/ddl', 'com.ddl.33.ddl', '0');
INSERT INTO `game_channel` VALUES ('70', '57', '1', 'http://pay.multisdk.com/800000013/v1/wdj', 'com.ddl.213121312.wdj', '0');
INSERT INTO `game_channel` VALUES ('71', '57', '2', 'http://pay.multisdk.com/800000013/v1/ddl', 'com.ddl.213121312.ddl', '0');
INSERT INTO `game_channel` VALUES ('72', '58', '1', 'http://pay.multisdk.com/800000014/v1/wdj', 'com.ddl.123.wdj', '0');
INSERT INTO `game_channel` VALUES ('73', '58', '2', 'http://pay.multisdk.com/800000014/v1/ddl', 'com.ddl.123.ddl', '0');

-- ----------------------------
-- Table structure for paycallback
-- ----------------------------
DROP TABLE IF EXISTS `paycallback`;
CREATE TABLE `paycallback` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_id` int(11) NOT NULL,
  `url` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `status` int(11) DEFAULT '0',
  `createtime` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of paycallback
-- ----------------------------
INSERT INTO `paycallback` VALUES ('1', '1', 'http://bill.ddianle.com:8090/111', '0', '2017-04-05 11:05:28');
INSERT INTO `paycallback` VALUES ('11', '1', '123124', '1', '2017-04-14 15:41:41');
INSERT INTO `paycallback` VALUES ('12', '2', '34343', '1', '2017-04-14 16:31:22');
INSERT INTO `paycallback` VALUES ('13', '2', '2212222', '1', '2017-04-14 16:33:40');
INSERT INTO `paycallback` VALUES ('14', '56', '11111111aaaa', '0', '2017-04-14 16:51:11');
INSERT INTO `paycallback` VALUES ('17', '53', '2222', '1', '2017-04-14 17:23:46');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `type` int(11) NOT NULL DEFAULT '0',
  `uname` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `logintime` datetime DEFAULT NULL,
  `expire_in` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('1', '1', '2', 'admin', null, null);
INSERT INTO `users` VALUES ('2', '2', '0', 'yangyan', null, null);
INSERT INTO `users` VALUES ('3', '3', '1', 'liuqiang', null, null);
INSERT INTO `users` VALUES ('11', '2016100003199890566', '2', 'aaa', '2017-05-03 16:25:25', null);
INSERT INTO `users` VALUES ('38', '5147485957120', '0', 'abc004', null, null);
INSERT INTO `users` VALUES ('39', '5147485957121', '0', '15721420895', null, null);
INSERT INTO `users` VALUES ('40', '5147485957122', '0', 'sdfsdfsdf', null, null);
INSERT INTO `users` VALUES ('41', '5147485957123', '0', 'testdsfs1', null, null);
INSERT INTO `users` VALUES ('42', '5147485957116', '2', 'abc001', '2017-04-27 16:55:22', '77278');
INSERT INTO `users` VALUES ('43', '5147485957124', '0', 'test1111ww', null, null);
INSERT INTO `users` VALUES ('44', '5147485957119', '0', 'abc003', null, null);
INSERT INTO `users` VALUES ('45', '5147485957125', '0', 'abc005', null, null);
INSERT INTO `users` VALUES ('46', '5147485957126', '0', 'test11aa', null, null);
INSERT INTO `users` VALUES ('47', '5147485957118', '1', 'abc002', '2017-04-27 16:12:13', '86400');
INSERT INTO `users` VALUES ('48', '5147485957127', '0', 'abc006', null, null);
INSERT INTO `users` VALUES ('50', '5147485957128', '0', '15721420895', '2017-04-26 14:55:02', '86335');
INSERT INTO `users` VALUES ('51', '5147485957111', '0', 'test1111', null, null);
INSERT INTO `users` VALUES ('52', '5147485957144', '0', 'abc009', '2017-04-27 14:37:46', '86400');
INSERT INTO `users` VALUES ('53', '5147485957145', '0', 'abc010', '2017-04-27 14:42:12', '86400');
INSERT INTO `users` VALUES ('54', '5147485957146', '0', 'abc011', '2017-04-27 14:44:47', '86400');
INSERT INTO `users` VALUES ('55', '5147485957147', '0', 'abc012', '2017-04-27 14:48:10', '86400');
INSERT INTO `users` VALUES ('56', '5147485957148', '0', 'abc013', '2017-04-27 14:50:28', '86400');
INSERT INTO `users` VALUES ('57', '5147485957149', '0', 'abc014', '2017-04-27 14:52:54', '86400');
INSERT INTO `users` VALUES ('58', '5147485957150', '0', 'abc015', '2017-04-27 14:55:16', '86400');
INSERT INTO `users` VALUES ('59', '5147485957151', '0', 'abc016', '2017-04-27 15:04:24', '86400');
INSERT INTO `users` VALUES ('61', '5147485957153', '0', 'abc017', '2017-04-27 15:39:45', '86366');

-- ----------------------------
-- Table structure for user_game
-- ----------------------------
DROP TABLE IF EXISTS `user_game`;
CREATE TABLE `user_game` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `game_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of user_game
-- ----------------------------
INSERT INTO `user_game` VALUES ('18', '3', '1');
INSERT INTO `user_game` VALUES ('19', '47', '1');
INSERT INTO `user_game` VALUES ('20', '47', '2');
