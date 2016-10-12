
DECLARE @loginName nvarchar(128);
declare @dbuser  nvarchar(128) = N'appuser';

select @loginName='$(Login)'

exec(
'If not Exists (select loginname from master.dbo.syslogins
    where name = '''+ @loginName + ''')
	begin
	CREATE LOGIN [' + @loginName+'] WITH PASSWORD = ''P@ssw0rd''
	end');

IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = @dbuser)
BEGIN
exec('CREATE USER ' + @dbuser + ' FOR LOGIN ['+ @loginName + ']');
EXEC sp_addrolemember N'db_datareader', @dbuser
EXEC sp_addrolemember N'db_datawriter', @dbuser
END;

-- Grant track change permission