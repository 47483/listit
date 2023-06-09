/*
SQLyog Community
MySQL - 5.7.36 : Database - listit_db
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*Table structure for table `items` */

DROP TABLE IF EXISTS `items`;

CREATE TABLE `items` (
  `itemid` int(10) NOT NULL AUTO_INCREMENT,
  `user` int(10) NOT NULL,
  `list` int(10) NOT NULL,
  `itemname` varchar(30) COLLATE utf8_swedish_ci NOT NULL,
  `status` tinyint(1) NOT NULL,
  `amount` int(4) NOT NULL,
  PRIMARY KEY (`itemid`),
  KEY `list` (`user`),
  KEY `list_2` (`list`),
  CONSTRAINT `items_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`userid`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `items_ibfk_2` FOREIGN KEY (`list`) REFERENCES `lists` (`listid`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

/*Table structure for table `lists` */

DROP TABLE IF EXISTS `lists`;

CREATE TABLE `lists` (
  `listid` int(10) NOT NULL AUTO_INCREMENT,
  `user` int(10) NOT NULL,
  `listname` varchar(30) COLLATE utf8_swedish_ci NOT NULL,
  PRIMARY KEY (`listid`),
  KEY `user` (`user`),
  CONSTRAINT `lists_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`userid`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `userid` int(10) NOT NULL AUTO_INCREMENT,
  `email` varchar(60) COLLATE utf8_swedish_ci NOT NULL,
  `password` varchar(160) COLLATE utf8_swedish_ci NOT NULL,
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
