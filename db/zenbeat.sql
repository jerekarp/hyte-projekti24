-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.10.2-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for zenbeat
CREATE DATABASE IF NOT EXISTS `zenbeat` /*!40100 DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci */;
USE `zenbeat`;


-- Dumping structure for table zenbeat.users
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL DEFAULT '',
  `password` varchar(255) NOT NULL DEFAULT '',
  `email` varchar(100) NOT NULL DEFAULT '',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `user_level` varchar(30) NOT NULL DEFAULT 'regular',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Dumping data for table zenbeat.users: ~1 rows (approximately)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;



-- Dumping structure for table zenbeat.diary
CREATE TABLE IF NOT EXISTS `diary` (
  `user_id` int(11) DEFAULT NULL,
  `entry_id` int(11) NOT NULL AUTO_INCREMENT,
  `entry_date` date NOT NULL,
  `mood` varchar(50) DEFAULT NULL,
  `weight` float(5,2) DEFAULT NULL,
  `sleep_hours` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `stress_level` int(11) DEFAULT NULL,
  PRIMARY KEY (`entry_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `FK_diary_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Dumping data for table zenbeat.diary: ~0 rows (approximately)
/*!40000 ALTER TABLE `diary` DISABLE KEYS */;
/*!40000 ALTER TABLE `diary` ENABLE KEYS */;

-- Dumping structure for table zenbeat.professionals
CREATE TABLE IF NOT EXISTS `professionals` (
  `user_id` int(11) DEFAULT NULL,
  `professional_id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `surname` varchar(100) NOT NULL,
  `work_location` varchar(100) NOT NULL,
  `job_title` varchar(50) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  PRIMARY KEY (`professional_id`),
  KEY `FK_professionals_users` (`user_id`),
  CONSTRAINT `FK_professionals_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Dumping data for table zenbeat.professionals: ~0 rows (approximately)
/*!40000 ALTER TABLE `professionals` DISABLE KEYS */;
/*!40000 ALTER TABLE `professionals` ENABLE KEYS */;

-- Dumping structure for table zenbeat.student_info
CREATE TABLE IF NOT EXISTS `student_info` (
  `user_id` int(11) DEFAULT NULL,
  `student_id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `surname` varchar(100) NOT NULL,
  `student_number` int(20) DEFAULT NULL,
  `weight` float(5,2) DEFAULT NULL,
  `height` float(5,2) DEFAULT NULL,
  `age` int(4) DEFAULT NULL,
  `gender` varchar(50) DEFAULT NULL,
  `stress_level` int(11) DEFAULT NULL,
  PRIMARY KEY (`student_id`),
  KEY `user_id` (`user_id`),
  KEY `FK_student_info_diary` (`weight`),
  KEY `stress_level` (`stress_level`),
  CONSTRAINT `FK__users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Dumping data for table zenbeat.student_info: ~0 rows (approximately)
/*!40000 ALTER TABLE `student_info` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_info` ENABLE KEYS */;

