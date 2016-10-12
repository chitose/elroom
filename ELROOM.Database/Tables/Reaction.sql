CREATE TABLE [dbo].[Reaction]
(
  [Id] INT NOT NULL PRIMARY KEY IDENTITY(1,1),
  [OwnerId] INT NOT NULL,
  [PostId] INT NULL,
  [CommentId] INT NULL,
  [Type] INT NOT NULL,
  [CreationDate] SMALLDATETIME NOT NULL,
    [ModificationDate] SMALLDATETIME NOT NULL, 
    [RowVersion] TIMESTAMP NOT NULL,
    CONSTRAINT [FK_Reaction_Post] FOREIGN KEY ([PostId]) REFERENCES [Post]([Id]),
    CONSTRAINT [FK_Reaction_Comment] FOREIGN KEY ([CommentId]) REFERENCES [Comment]([Id]),
    CONSTRAINT [FK_Reaction_User] FOREIGN KEY ([OwnerId]) REFERENCES [AppUser]([Id])
)
