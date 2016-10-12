CREATE TABLE [dbo].[Group]
(
  [Id] INT NOT NULL PRIMARY KEY IDENTITY(1,1),
  [Name] NVARCHAR(255) NOT NULL,
  [Image] VARBINARY(MAX) NULL,
  [Private] bit not null,
  [Description] NVARCHAR(2000),
  [OwnerId] INT NOT NULL,
  [CreationDate] SMALLDATETIME NOT NULL,
    [ModificationDate] SMALLDATETIME NOT NULL, 
    [RowVersion] TIMESTAMP NOT NULL,
    CONSTRAINT [FK_Group_AppUser] FOREIGN KEY ([OwnerId]) REFERENCES [AppUser]([Id])
)

GO

CREATE UNIQUE INDEX [IX_Group_Name] ON [dbo].[Group] ([Name])