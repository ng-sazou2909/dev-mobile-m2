using System;
using System.IO;

class Program
{
    static void Main()
    {
        DriveInfo[] tousLesLecteurs = DriveInfo.GetDrives();
        foreach (DriveInfo d in tousLesLecteurs)
        {
            Console.WriteLine("Lecteur {0}", d.Name);
            Console.WriteLine("Type Lecteur: {0}", d.DriveType);
            if (d.IsReady == true)
            {
                Console.WriteLine(" Label Volume : {0}", d.VolumeLabel);
                Console.WriteLine(" Système de fichiers : {0}", d.DriveFormat);
                Console.WriteLine(
                " Espace disponible pour utilisateur courant:{0, 15} octets",
                d.AvailableFreeSpace);
                Console.WriteLine(
                " Espace disponible Total : {0, 15} octets",
                d.TotalFreeSpace);
                Console.WriteLine(
                " Taille Totale lecteur: {0, 15} octets ",
                d.TotalSize);
            }
        }
    }
}