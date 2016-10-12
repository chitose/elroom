CREATE TABLE [dbo].[Comment]
(
  [Id] INT NOT NULL PRIMARY KEY IDENTITY(1,1),
  [Image] VARBINARY(MAX) NULL,
  [Sticker] NVARCHAR(255) NULL,
  [Content] NVARCHAR(2000) NULL,
  [OwnerId] INT NOT NULL,
  [PostId] INT NOT NULL,
  [CreationDate] SMALLDATETIME NOT NULL,
    [ModificationDate] SMALLDATETIME NOT NULL, 
    [RowVersion] TIMESTAMP NOT NULL,
    CONSTRAINT [FK_Comment_Post] FOREIGN KEY ([PostId]) REFERENCES [Post]([Id]), 
    CONSTRAINT [FK_Comment_User] FOREIGN KEY ([OwnerId]) REFERENCES [AppUser]([Id]), 
)
