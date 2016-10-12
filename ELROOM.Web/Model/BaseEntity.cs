using System;
using ELROOM.Web.Infrastructure;

namespace ELROOM.Web.Model
{
    public class BaseEntity : IAuditable
    {
        public int Id { get; set; }
        [OptionalModel]
        public DateTime CreationDate { get; set; }
        [OptionalModel]
        public DateTime ModificationDate { get; set; }
        [OptionalModel]
        public byte[] RowVersion { get; set; }
    }
}