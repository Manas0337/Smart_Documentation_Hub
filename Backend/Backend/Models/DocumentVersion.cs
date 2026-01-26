using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class DocumentVersion
    {
        [Key]
        public int VersionId { get; set; }
        public int DocId { get; set; }
        public int VersionNumber { get; set; }
        public string FilePath { get; set; }

        // CRITICAL for this step
        public string OriginalText { get; set; }

        public DateTime UploadedAt { get; set; }
        public int CreatedById { get; set; }
    }

}
