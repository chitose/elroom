CREATE FUNCTION [dbo].[calculateLastCommentDate]
(
    @postId int
)
RETURNS SmallDateTime
AS
BEGIN
    return (Select TOP 1 [ModificationDate] from [Comment]
    WHERE [PostId] = @postId);
END