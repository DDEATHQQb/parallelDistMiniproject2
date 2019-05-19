drop database if exists parallel_distributed;
create database parallel_distributed;
use parallel_distributed;
create table SystemUser (
  userID int auto_increment,
  username varchar (12) not null,
  pass varchar (12) not null,
  primary key (userID)
);
create table GroupChat (
  groupID int auto_increment,
  groupName varchar (40) not null,
  primary key (groupID)
);
create table ChatLog (
  messageID int auto_increment,
  message varchar (100) not null,
  timeSend timestamp not null,
  primary key (messageID)
);
create table JoinGroup (
  JGuserID int,
  JGgroupID int,
  isExit enum('0', '1'),
  latestTimeRead timestamp not null,
  primary key (JGuserID, JGgroupID),
  foreign key (JGuserID) references SystemUser (userID) on
            update cascade,
  foreign key(JGgroupID) references GroupChat(groupID) on
            update cascade
);
create table Chat (
  ChatuserID int,
  ChatgroupID int,
  ChatmessageID int,
  primary key(ChatuserID, ChatgroupID, ChatmessageID),
  foreign key(ChatuserID) references SystemUser(userID) on update cascade,
  foreign key(ChatgroupID) references GroupChat(groupID) on update cascade,
  foreign key(ChatmessageID) references ChatLog(messageID) on update cascade
);
create table room (
  roomID varchar(40) not null,
  primary key (roomID)
);
create table room_users (
  roomID varchar(40) not null,
  username varchar(40) not null,
  primary key (roomID, username) --   ,foreign key (roomID) references Room (roomID) on
  --             update cascade
);
insert into
  SystemUser (username, pass)
values
  ('oak', '123'),
  ('nook', '123'),
  ('earth', '123'),
  ('draft', '123');
insert into
  GroupChat (groupName)
values
  ('Dream Team'),
  ('Road To Conqueror'),
  ('Drinking'),
  ('DPLOP');
insert into
  ChatLog (message, timeSend)
values
  ('Hello World', '2019-03-02 20:45:20'),
  ('Eiei', '2019-03-03 11:50:13'),
  ('Algorithm Design so fun', '2019-03-05 04:04:00'),
  ('Parallel so ez', '2019-03-04 04:04:00'),
  ('Parallel1 so ez', '2019-03-05 05:14:00'),
  ('Parallel2 so ez', '2019-03-05 06:24:00');
insert into
  JoinGroup (JGuserID, JGgroupID, isExit, latestTimeRead)
values
  (1, 1, '1', '2019-03-04 18:00:45'),
  (1, 2, '1', '2019-04-03 10:00:00'),
  (2, 2, '1', '2019-03-02 20:15:20'),
  (2, 1, '1', '2019-03-03 11:30:13'),
  (3, 1, '1', '2019-03-05 03:04:00');
insert into
  Chat (ChatuserID, ChatgroupID, ChatmessageID)
values
  (1, 1, 2),
  (2, 2, 3),
  (3, 2, 1),
  (2, 1, 4),
  (1, 1, 5),
  (2, 1, 6);
--     insert into Room
  --     (roomID)
  -- values
  --     ('ROOM1'),('ROOM2'),('ROOM3');
  --     insert into room_users (roomID,username)
  --     values
  --     ('ROOM1','JIM'),('ROOM1','JAMES'),('ROOM2','Koko')