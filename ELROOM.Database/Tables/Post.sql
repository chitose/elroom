CREATE TABLE [dbo].[Post]
(
  [Id] INT NOT NULL PRIMARY KEY IDENTITY(1,1),
  [Title] NVARCHAR(255) NOT NULL,
  [Content] NVARCHAR(2000) NULL,
  [GroupId] INT NOT NULL,
  [OwnerId] INT NOT NULL,
  [PollStart] SMALLDATETIME NULL,
  [PollEnd] SMALLDATETIME NULL,
  [CreationDate] SMALLDATETIME NOT NULL,
    [ModificationDate] SMALLDATETIME NOT NULL, 
    [RowVersion] TIMESTAMP NOT NULL,
    [Image] VARBINARY(MAX) NULL, 
    [LastCommentDate] AS ([dbo].[calculateLastCommentDate]([Id])),
    CONSTRAINT [FK_Post_Group] FOREIGN KEY ([GroupId]) REFERENCES [Group]([Id]), 
    CONSTRAINT [FK_Post_User] FOREIGN KEY ([OwnerId]) REFERENCES [AppUser]([Id])
)
