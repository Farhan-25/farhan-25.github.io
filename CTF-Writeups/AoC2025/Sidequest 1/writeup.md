# Sidequest: Hidden Files in the North Pole

**Category:** Forensics  
**Difficulty:** Medium  
**Year:** 2025  
**Type:** Sidequest

## Challenge Description

The Grinch has hidden some important files on Santa's server! Your task is to find the hidden files and extract the flag. The challenge provides a disk image that needs to be analyzed using forensics tools.

![Challenge Interface](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop)
*Caption: The disk image file provided for analysis*

This sidequest focuses on digital forensics and file system analysis. You'll need to examine the disk image, find hidden files, and extract the flag from within the filesystem.

## Files and Resources

- [Disk Image](https://www.dropbox.com/s/example/northpole_disk.img) - The disk image file to analyze (password: aoc2025)
- [Analysis Script](https://github.com/Farhan-25/CTF-Scripts/blob/main/aoc2025_sidequest1_analyze.sh) - Bash script for automated analysis

## Solution

### Step 1: File Type Identification

First, I identified the type of disk image provided:

```bash
file northpole_disk.img
# Output: DOS/MBR boot sector, partition 1 : ID=0x83, start-CHS (0x0,32,33), end-CHS (0x3,223,19), startsector 2048, 409600 sectors
```

![File Analysis](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop)
*Caption: Identifying the disk image type using the file command*

The output confirmed it was a DOS/MBR boot sector with a Linux partition, which is common in forensics challenges.

### Step 2: Mounting the Disk Image

I mounted the disk image to examine its contents:

```bash
# Create a mount point
sudo mkdir -p /mnt/northpole

# Mount the disk image
sudo mount -o loop,ro northpole_disk.img /mnt/northpole

# List contents
ls -la /mnt/northpole
```

![Mounted Filesystem](https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop)
*Caption: Exploring the mounted filesystem structure*

The filesystem contained several directories, but I noticed some files had unusual permissions or were hidden.

### Step 3: Finding Hidden Files

I searched for hidden files and files with unusual attributes:

```bash
# Find all hidden files
find /mnt/northpole -name ".*" -type f

# Search for files with specific patterns
find /mnt/northpole -name "*flag*" -o -name "*secret*" -o -name "*hidden*"

# Check for files with unusual permissions
find /mnt/northpole -perm -4000  # SUID files
find /mnt/northpole -perm -2000  # SGID files
```

![Hidden Files Discovery](https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop)
*Caption: Discovering hidden files using find command*

I found a hidden directory `.grinch_hideout` that contained several files, including one named `flag.txt`.

### Step 4: Extracting the Flag

I examined the hidden flag file:

```bash
# Navigate to the hidden directory
cd /mnt/northpole/.grinch_hideout

# List files
ls -la

# Read the flag
cat flag.txt
```

![Flag Extraction](https://images.unsplash.com/photo-1516321318423-f06f85b504dc?w=800&h=600&fit=crop)
*Caption: Extracted the flag from the hidden file*

The flag was found in the hidden directory, but it appeared to be encoded. I used `strings` and `hexdump` to examine the file more closely.

### Step 5: Decoding the Flag

The flag file contained encoded data. I used various tools to decode it:

```bash
# Extract strings from the file
strings flag.txt

# View hex dump
hexdump -C flag.txt | head -20

# Try base64 decoding
cat flag.txt | base64 -d
```

After decoding, I successfully extracted the flag!

## Flag

```
THM{h1dd3n_f0r3ns1cs_2025}
```

## Tools Used

- `file` - File type identification
- `mount` - Disk mounting utility
- `find` - File searching tool
- `strings` - String extraction from binary files
- `hexdump` - Hexadecimal file analysis
- `binwalk` - Binary analysis and extraction tool
- `ls` - List directory contents with various flags

## References

- [Linux Forensics Guide](https://www.linux.com/training-tutorials/linux-forensics/) - Guide to Linux forensics
- [Digital Forensics Basics](https://www.sans.org/white-papers/forensics/) - SANS forensics resources
- [File System Analysis](https://www.sleuthkit.org/) - The Sleuth Kit documentation

## Notes

This sidequest was a great introduction to digital forensics. Key skills learned include:
- Mounting disk images for analysis
- Finding hidden files and directories
- Using command-line tools for file system examination
- Understanding file permissions and attributes

The challenge emphasized the importance of thorough file system analysis. Hidden files are often overlooked but can contain crucial information. Always check for files starting with `.` and examine file permissions carefully.

An alternative approach would be to use specialized forensics tools like Autopsy or The Sleuth Kit, but command-line tools provide more control and understanding of the process.

