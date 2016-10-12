if not exists (select 1 from [Right])
begin
  insert into [Right] (id, name) values
  (1, 'Admin-User-Role'),
  (2, 'Data-Read-All'),
  (3, 'Data-Write-All')
end

if not exists (select 1 from [Role])
begin
  insert into [Role] (name, Remarks, CreationDate, ModificationDate)
  values
  ('Administrator', 'Default build-in administrator role', sysdatetime(), sysdatetime());
    
  declare @roleId INT = scope_identity();

  insert into RoleRight(RoleId, [Right])
  select @roleId, Id from [Right]

  insert into [Role] (name, Remarks, CreationDate, ModificationDate)
  values ('User', 'Default user role', sysdatetime(), sysdatetime());

  set @roleId = scope_identity();

  insert into RoleRight(RoleId, [Right]) Values (@roleId,2)
end