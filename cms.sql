-- 内容管理系统

create database if not exists cms;

use cms;

-- 用户表
create table users(
	id int primary key auto_increment,
    username varchar(50) not null, -- 用户名
    nickname varchar(50) not null, -- 昵称
    password varchar(50) not null, -- 密码
    email varchar(50) not null, -- 邮箱
    avatar varchar(100) null, -- 头像
    gender bit null, -- 性别
    create_time datetime not null, -- 创建时间
    modify_time datetime not null -- 修改时间
);

-- 话题表
create table topics(
	id int primary key auto_increment,
    title varchar(100) not null, -- 文章标题
    content text not null, -- 文章内容
    user_id int not null, -- 所属用户
    create_time datetime not null, -- 创建时间
    modify_time datetime not null -- 修改时间
);

-- 评论表
create table comments (
	id int primary key auto_increment,
    content text not null, -- 评论内容
    praise int null,
    create_time bigint not null, -- 创建时间
    modify_time bigint not null, -- 修改时间
    topics_id int not null, -- 所属话题
    user_id int not null, -- 所属用户
    reply_id int null -- 所属回复人
)
