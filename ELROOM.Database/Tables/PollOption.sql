CREATE TABLE [dbo].[PollOption]
(
  [Id] INT NOT NULL PRIMARY KEY IDENTITY(1,1),
  [PostId] INT NOT NULL,
  [Content] NVARCHAR(255) NOT NULL,
  [CreationDate] SMALLDATETIME NOT NULL,
    [ModificationDate] SMALLDATETIME NOT NULL,
    [RowVersion] TIMESTAMP NOT NULL, 
    CONSTRAINT [FK_PollOption_Post] FOREIGN KEY ([PostId]) REFERENCES [Post]([Id]), 
)
