CREATE TABLE [dbo].[UserPost]
(
  [Id] INT NOT NULL PRIMARY KEY IDENTITY(1,1),
  [UserId] INT NOT NULL,
  [PostId] INT NOT NULL,  
  CONSTRAINT [FK_UserPost_AppUser] FOREIGN KEY ([UserId]) REFERENCES [AppUser]([Id]), 
  CONSTRAINT [FK_UserPost_Post] FOREIGN KEY ([PostId]) REFERENCES [Post]([Id])
)
