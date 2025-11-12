# Forensics Basic Challenge

**Category:** Forensics  
**Difficulty:** Easy  
**CTF:** HTB

## Description

A basic forensics challenge requiring analysis of a disk image to find hidden files and extract the flag.

## Solution

### Step 1: File Analysis

Used `file` command to identify the disk image type:

```bash
file disk.img
# Output: DOS/MBR boot sector
```

### Step 2: Mounting the Image

Mounted the disk image to examine its contents:

```bash
sudo mount -o loop disk.img /mnt/forensics
```

### Step 3: Flag Extraction

Found a hidden file in the root directory:

```bash
ls -la /mnt/forensics
cat /mnt/forensics/.hidden_flag.txt
```

## Screenshots

![Disk Image Analysis](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop)
*Analyzing the disk image using file command*

![Mounted Filesystem](https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop)
*Exploring the mounted filesystem structure*

![Hidden File Discovery](https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop)
*Found the hidden flag file using ls -la*

![Flag Extraction](https://images.unsplash.com/photo-1516321318423-f06f85b504dc?w=800&h=600&fit=crop)
*Extracted the flag from the hidden file*

## Files and Resources

- [Disk Image](https://www.dropbox.com/s/example/disk.img) - Original disk image file (password: htb2024)
- [Analysis Script](https://github.com/Farhan-25/CTF-Scripts/blob/main/forensics_analyze.sh) - Bash script for automated analysis
- [Forensics Toolkit](https://drive.google.com/file/d/example321/view) - Collection of forensics tools

## Flag

```
HTB{f0r3ns1cs_101}
```

## Tools Used

- `file` - File type identification
- `mount` - Disk mounting
- `strings` - String extraction
- `hexdump` - Hexadecimal file analysis
- `binwalk` - Binary analysis tool

## References

- [Digital Forensics Basics](https://www.sans.org/white-papers/forensics/)
- [Linux Forensics Guide](https://www.linux.com/training-tutorials/linux-forensics/)

