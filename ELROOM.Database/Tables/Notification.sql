CREATE TABLE [dbo].Notification
(
  [Id] INT NOT NULL PRIMARY KEY IDENTITY(1, 1),
  [AuthorId] INT NOT NULL,
  [PostId] INT NOT NULL,
	[Content] NVARCHAR(2000) NULL,
  [CreationDate] SMALLDATETIME NOT NULL,
	[ModificationDate] SMALLDATETIME NOT NULL, 
  [RowVersion] TIMESTAMP NOT NULL,

	CONSTRAINT [FK_Notification_Author] FOREIGN KEY ([AuthorId]) REFERENCES [AppUser]([Id]), 
  CONSTRAINT [FK_Notification_Post] FOREIGN KEY ([PostId]) REFERENCES [Post]([Id]) ON DELETE CASCADE,
)
