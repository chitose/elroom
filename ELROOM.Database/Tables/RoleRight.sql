CREATE TABLE [dbo].[RoleRight]
(
    [Id] INT NOT NULL PRIMARY KEY IDENTITY(1, 4),
    [RoleId] INT NOT NULL REFERENCES [Role](Id) ON DELETE CASCADE,
    [Right] INT NOT NULL REFERENCES [Right](Id)
)

GO

CREATE UNIQUE INDEX [UK_RoleRight] ON [dbo].[RoleRight] ([RoleId], [Right])