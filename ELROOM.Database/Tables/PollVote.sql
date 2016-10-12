CREATE TABLE [dbo].[PollVote]
(
  [Id] INT NOT NULL PRIMARY KEY IDENTITY(1,1),
  [OwnerId] INT NOT NULL,
  [PollId] INT NOT NULL,
  [CreationDate] SMALLDATETIME NOT NULL,
    [ModificationDate] SMALLDATETIME NOT NULL,
    [RowVersion] TIMESTAMP NOT NULL, 
    CONSTRAINT [FK_PollVote_Poll] FOREIGN KEY ([PollId]) REFERENCES [PollOption]([Id]), 
    CONSTRAINT [FK_PollVote_User] FOREIGN KEY ([OwnerId]) REFERENCES [AppUser]([Id]), 
)
