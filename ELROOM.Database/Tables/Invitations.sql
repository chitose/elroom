CREATE TABLE [dbo].[Invitations]
(
  [Id] INT NOT NULL PRIMARY KEY IDENTITY(1, 1),
  [UserId] INT NOT NULL,
  [GroupId] INT NOT NULL,
  [CreationDate] SMALLDATETIME NOT NULL,

    [ModificationDate] SMALLDATETIME NOT NULL, 
    [RowVersion] TIMESTAMP NOT NULL, 
    CONSTRAINT [FK_Invitations_AppUser] FOREIGN KEY ([UserId]) REFERENCES [AppUser]([Id]) ON DELETE CASCADE, 
  CONSTRAINT [FK_Invitations_Group] FOREIGN KEY ([GroupId]) REFERENCES [Group]([Id]) ON DELETE CASCADE,
)
