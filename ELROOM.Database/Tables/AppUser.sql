CREATE TABLE [dbo].[AppUser]
(
  -- ASP.NET Identity
	[Id] INT NOT NULL PRIMARY KEY IDENTITY(1, 1),
	[UserName] NVARCHAR(256) NOT NULL,
	[PasswordHash] NVARCHAR(100) NULL,
  [SecurityStamp] NVARCHAR(40) NOT NULL,
  [LockoutEnd] DATETIMEOFFSET(0) NULL,
  [LockoutEnabled] BIT NOT NULL,
  [AccessFailedCount] INT NOT NULL,
  [FirstName] NVARCHAR(100) NOT NULL,
	[LastName] NVARCHAR(100) NOT NULL,
  [Email] NVARCHAR(255) NULL,
  [Phone] NVARCHAR(100) NULL,
  -- Custom properties
  [RoleId] INT NOT NULL REFERENCES Role(Id),	
  [Avatar] VARBINARY(MAX) NULL,
  [Options] NVARCHAR(2000),
  [CreationDate] SMALLDATETIME NOT NULL,
  [ModificationDate] SMALLDATETIME NOT NULL,
  [RowVersion] TIMESTAMP NOT NULL
)

GO

CREATE UNIQUE INDEX [IX_AppUser_UserName] ON [dbo].[AppUser] ([UserName])

GO