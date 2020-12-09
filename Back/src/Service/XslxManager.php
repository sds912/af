<?php
namespace App\Service;

use PhpOffice\PhpSpreadsheet\IOFactory;

class XslxManager
{
    public function getDataToArray($xlsFileName)
    {
        $spreadsheet = IOFactory::load($xlsFileName); // Here we are able to read from the excel file

        $spreadsheet->getActiveSheet()->removeRow(1); // I added this to be able to remove the first file line 

        return $spreadsheet->getActiveSheet()->toArray(null, true, true, true); // here, the read data is turned into an array
    }
}