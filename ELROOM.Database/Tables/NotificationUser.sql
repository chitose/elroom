CREATE TABLE [dbo].NotificationUser
(
  [Id] INT NOT NULL PRIMARY KEY IDENTITY(1, 1),
  [NotificationId] INT NOT NULL,
	[UserId] INT NOT NULL,
	[IsNew] BIT NOT NULL ,
	[IsRead] BIT NOT NULL ,
	[CreationDate] SMALLDATETIME NOT NULL,
	[ModificationDate] SMALLDATETIME NOT NULL,  
  [RowVersion] TIMESTAMP NOT NULL,
	CONSTRAINT [FK_NotificationUser_Notification] FOREIGN KEY ([NotificationId]) REFERENCES [Notification]([Id]), 
	CONSTRAINT [FK_NotificationUser_AppUser] FOREIGN KEY ([UserId]) REFERENCES [AppUser]([Id]),
)
