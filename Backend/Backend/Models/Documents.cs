using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Documents
    {
        [Key]
        public int DocId { get; set; }

        [Required]
        public string Title { get; set; }

        public string Description { get; set; }
        public string Category { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int OwnerId { get; set; }
        public User Owner { get; set; }

        public ICollection<DocumentVersion> Versions { get; set; }
    }
}
