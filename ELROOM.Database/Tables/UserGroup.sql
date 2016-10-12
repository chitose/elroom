CREATE TABLE [dbo].[UserGroup]
(
  [Id] INT NOT NULL PRIMARY KEY IDENTITY(1, 1),
  [UserId] INT NOT NULL,
  [GroupId] INT NOT NULL,
  [CreationDate] SMALLDATETIME NOT NULL,
    [ModificationDate] SMALLDATETIME NOT NULL, 
    [Favorite] BIT NOT NULL DEFAULT 0, 
    [RowVersion] TIMESTAMP NOT NULL,
    CONSTRAINT [FK_UserGroup_AppUser] FOREIGN KEY ([UserId]) REFERENCES [AppUser]([Id]), 
    CONSTRAINT [FK_UserGroup_Group] FOREIGN KEY ([GroupId]) REFERENCES [Group]([Id]),
)
