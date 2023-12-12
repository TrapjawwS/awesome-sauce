-- phpMyAdmin SQL Dump
-- version 4.0.10.19
-- https://www.phpmyadmin.net
--
-- Host: studentdb-maria.gl.umbc.edu
-- Generation Time: May 15, 2017 at 07:25 PM
-- Server version: 10.1.22-MariaDB
-- PHP Version: 5.4.44

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `dschom1`
--

-- --------------------------------------------------------

--
-- Table structure for table `scoreboard`
--

CREATE TABLE IF NOT EXISTS `scoreboard` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(25) NOT NULL,
  `points` int(11) NOT NULL,
  `rating` varchar(12) NOT NULL,
  `original` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=96 ;

--
-- Dumping data for table `scoreboard`
--

INSERT INTO `scoreboard` (`id`, `name`, `points`, `rating`, `original`) VALUES
(64, 'Stephen Meek', 7650, 'Trail Guide', 1),
(65, 'Celinda Hines', 5694, 'Adventurer', 1),
(66, 'Andrew Sublette', 4138, 'Adventurer', 1),
(67, 'David Hastings', 2945, 'Adventurer', 1),
(68, 'Ezra Meeker', 2052, 'Greenhorn', 1),
(69, 'William Vaughn', 1401, 'Greenhorn', 1),
(70, 'Mary Bartlett', 937, 'Greenhorn', 1),
(71, 'William Wiggins', 615, 'Greenhorn', 1),
(72, 'Charles Hopper', 396, 'Greenhorn', 1),
(73, 'Stephen Meek', 250, 'Greenhorn', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tombstone`
--

CREATE TABLE IF NOT EXISTS `tombstone` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(25) NOT NULL,
  `message` varchar(140) NOT NULL,
  `sector` varchar(50) NOT NULL,
  `mile` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=11 ;

--
-- Dumping data for table `tombstone`
--

INSERT INTO `tombstone` (`id`, `name`, `message`, `sector`, `mile`) VALUES
(9, 'John', 'message 1', 'Independence|Kansas', 5);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
