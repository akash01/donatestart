'use strict';

angular.module('donations').controller('DonationsController', ['$scope', '$stateParams', '$location','Donations','Authentication','$window','toaster',
  function($scope, $stateParams, $location,Donations,Authentication,$window,toaster) {
    $scope.authentication = Authentication;

    $window.JR.apikey('jr-b5e6b58e33efd19cd84728b19d837c62');
    console.log('$scope.authentication',$scope.authentication);
    Donations.query(function(data){
        if (data[0]) {
            $scope.curSym = data[0]._id;
            $scope.balance = data[0].balance;
        } else {
            $scope.curSym = 'USD';
            $scope.balance = 0;
        }
    });

    if ($scope.authentication.user) {
        $scope.fullName = $scope.authentication.user.displayName;
        $scope.email = $scope.authentication.user.email;
    }
    // if ($scope.authentication.user && $scope.authentication.user.provider === 'twitter') {
    //     $scope.fullName = $scope.authentication.user.displayName;
    //     $scope.email = $scope.authentication.user.email;
    // }
    // if ($scope.authentication.user && $scope.authentication.user.provider === 'google') {
    //     $scope.fullName = $scope.authentication.user.displayName;
    //     $scope.email = $scope.authentication.user.email;
    // }
    $scope.create = function() {
        var donation = new Donations({
            fullName: this.fullName,
            email: this.email,
            organisation: this.organisation,
            amount: this.amount,
            currency: this.selectedCurrency.code
        });

        if (donation.currency !== 'USD') {
            $window.JR.from(donation.currency).to('USD').amount(donation.amount).convert(function(result) {
                donation.currency = result.to;
                donation.amount = result.amount;
                $scope.createRecord(donation);
            });
            return;
        }
        $scope.createRecord(donation);
    };

    $scope.createRecord = function(donation) {
        donation.$save(function(response) {
            $window.location.reload();
            $scope.fullName = '';
            $scope.email = '';
            $scope.organisation = '';
            $scope.amount = '';
            //$scope.currency = '';
        }, function(errorResponse) {
            console.log('msg',errorResponse.data,toaster);
            toaster.pop('error', '', errorResponse.data.message);
            //$scope.error = errorResponse.data.message;
        });
    };

    $scope.find = function() {
        $scope.donations = Donations.query();
        //$scope.donations = 'this is test one.';
    };

    $scope.options = {
        useEasing : true,
        useGrouping : true,
        separator : ',',
        decimal : '.',
        prefix : '',
        suffix : ''
    };

    $scope.currencies = [
        {   code: 'AFN',
            text: 'Afghani',
        },
        {   code: 'EUR',
            text: 'Euro',
        },
        {   code: 'ALL',
            text: 'Lek',
        },
        {   code: 'DZD',
            text: 'Algerian Dinar',
        },
        {   code: 'USD',
            text: 'US Dollar',
        },
        {   code: 'AOA',
            text: 'Kwanza',
        },
        {   code: 'XCD',
            text: 'East Caribbean Dollar',
        },
        {   code: 'ARS',
            text: 'Argentine Peso',
        },
        {   code: 'AMD',
            text: 'Armenian Dram',
        },
        {   code: 'AWG',
            text: 'Aruban Florin',
        },
        {   code: 'AUD',
            text: 'Australian Dollar',
        },
        {   code: 'AZN',
            text: 'Azerbaijanian Manat',
        },
        {   code: 'BSD',
            text: 'Bahamian Dollar',
        },
        {   code: 'BHD',
            text: 'Bahraini Dinar',
        },
        {   code: 'BDT',
            text: 'Taka',
        },
        {   code: 'BBD',
            text: 'Barbados Dollar',
        },
        {   code: 'BYR',
            text: 'Belarussian Ruble',
        },
        {   code: 'BZD',
            text: 'Belize Dollar',
        },
        {   code: 'XOF',
            text: 'CF Franc BCEAO',
        },
        {   code: 'BMD',
            text: 'Bermudian Dollar',
        },
        {   code: 'BTN',
            text: 'Ngultrum',
        },
        {   code: 'INR',
            text: 'Indian Rupee',
        },
        {   code: 'BOB',
            text: 'Boliviano',
        },
        {   code: 'BOV',
            text: 'Mvdol',
        },
        {   code: 'BAM',
            text: 'Convertible Mark',
        },
        {   code: 'BWP',
            text: 'Pula',
        },
        {   code: 'NOK',
            text: 'Norwegian Krone',
        },
        {   code: 'BRL',
            text: 'Brazilian Real',
        },
        {   code: 'BND',
            text: 'Brunei Dollar',
        },
        {   code: 'BGN',
            text: 'Bulgarian Lev',
        },
        {   code: 'BIF',
            text: 'Burundi Franc',
        },
        {   code: 'KHR',
            text: 'Riel',
        },
        {   code: 'XAF',
            text: 'CF Franc BEAC',
        },
        {   code: 'CAD',
            text: 'Canadian Dollar',
        },
        {   code: 'CVE',
            text: 'Cabo Verde Escudo',
        },
        {   code: 'KYD',
            text: 'Cayman Islands Dollar',
        },
        {   code: 'CLF',
            text: 'Unidad de Fomento',
        },
        {   code: 'CLP',
            text: 'Chilean Peso',
        },
        {   code: 'CNY',
            text: 'Yuan Renminbi',
        },
        {   code: 'COP',
            text: 'Colombian Peso',
        },
        {   code: 'COU',
            text: 'Unidad de Valor Real',
        },
        {   code: 'KMF',
            text: 'Comoro Franc',
        },
        {   code: 'CDF',
            text: 'Congolese Franc',
        },
        {   code: 'NZD',
            text: 'New Zealand Dollar',
        },
        {   code: 'CRC',
            text: 'Cost Rican Colon',
        },
        {   code: 'HRK',
            text: 'Croatian Kuna',
        },
        {   code: 'CUC',
            text: 'Peso Convertible',
        },
        {   code: 'CUP',
            text: 'Cuban Peso',
        },
        {   code: 'ANG',
            text: 'Netherlands Antillean Guilder',
        },
        {   code: 'CZK',
            text: 'Czech Koruna',
        },
        {   code: 'DKK',
            text: 'Danish Krone',
        },
        {   code: 'DJF',
            text: 'Djibouti Franc',
        },
        {   code: 'DOP',
            text: 'Dominican Peso',
        },
        {   code: 'EGP',
            text: 'Egyptian Pound',
        },
        {   code: 'SVC',
            text: 'El Salvador Colon',
        },
        {   code: 'ERN',
            text: 'Nakfa',
        },
        {   code: 'ETB',
            text: 'Ethiopian Birr',
        },
        {   code: 'FKP',
            text: 'Falkland Islands Pound',
        },
        {   code: 'FJD',
            text: 'Fiji Dollar',
        },
        {   code: 'XPF',
            text: 'CFP Franc',
        },
        {   code: 'GMD',
            text: 'Dalasi',
        },
        {   code: 'GEL',
            text: 'Lari',
        },
        {   code: 'GHS',
            text: 'Ghan Cedi',
        },
        {   code: 'GIP',
            text: 'Gibraltar Pound',
        },
        {   code: 'GTQ',
            text: 'Quetzal',
        },
        {   code: 'GBP',
            text: 'Pound Sterling',
        },
        {   code: 'GNF',
            text: 'Guine Franc',
        },
        {   code: 'GYD',
            text: 'Guyan Dollar',
        },
        {   code: 'HTG',
            text: 'Gourde',
        },
        {   code: 'HNL',
            text: 'Lempira',
        },
        {   code: 'HKD',
            text: 'Hong Kong Dollar',
        },
        {   code: 'HUF',
            text: 'Forint',
        },
        {   code: 'ISK',
            text: 'Iceland Krona',
        },
        {   code: 'IDR',
            text: 'Rupiah',
        },
        {   code: 'XDR',
            text: 'SDR (Special Drawing Right)',
        },
        {   code: 'IRR',
            text: 'Iranian Rial',
        },
        {   code: 'IQD',
            text: 'Iraqi Dinar',
        },
        {   code: 'ILS',
            text: 'New Israeli Sheqel',
        },
        {   code: 'JMD',
            text: 'Jamaican Dollar',
        },
        {   code: 'JPY',
            text: 'Yen',
        },
        {   code: 'JOD',
            text: 'Jordanian Dinar',
        },
        {   code: 'KZT',
            text: 'Tenge',
        },
        {   code: 'KES',
            text: 'Kenyan Shilling',
        },
        {   code: 'KPW',
            text: 'North Korean Won',
        },
        {   code: 'KRW',
            text: 'Won',
        },
        {   code: 'KWD',
            text: 'Kuwaiti Dinar',
        },
        {   code: 'KGS',
            text: 'Som',
        },
        {   code: 'LAK',
            text: 'Kip',
        },
        {   code: 'LBP',
            text: 'Lebanese Pound',
        },
        {   code: 'LSL',
            text: 'Loti',
        },
        {   code: 'ZAR',
            text: 'Rand',
        },
        {   code: 'LRD',
            text: 'Liberian Dollar',
        },
        {   code: 'LYD',
            text: 'Libyan Dinar',
        },
        {   code: 'CHF',
            text: 'Swiss Franc',
        },
        {   code: 'LTL',
            text: 'Lithuanian Litas',
        },
        {   code: 'MOP',
            text: 'Pataca',
        },
        {   code: 'MKD',
            text: 'Denar',
        },
        {   code: 'MGA',
            text: 'Malagasy riary',
        },
        {   code: 'MWK',
            text: 'Kwacha',
        },
        {   code: 'MYR',
            text: 'Malaysian Ringgit',
        },
        {   code: 'MVR',
            text: 'Rufiyaa',
        },
        {   code: 'MRO',
            text: 'Ouguiya',
        },
        {   code: 'MUR',
            text: 'Mauritius Rupee',
        },
        {   code: 'XUA',
            text: 'ADB Unit of ccount',
        },
        {   code: 'MXN',
            text: 'Mexican Peso',
        },
        {   code: 'MXV',
            text: 'Mexican Unidad de Inversion (UDI)',
        },
        {   code: 'MDL',
            text: 'Moldovan Leu',
        },
        {   code: 'MNT',
            text: 'Tugrik',
        },
        {   code: 'MAD',
            text: 'Moroccan Dirham',
        },
        {   code: 'MZN',
            text: 'Mozambique Metical',
        },
        {   code: 'MMK',
            text: 'Kyat',
        },
        {   code: 'NAD',
            text: 'Namibi Dollar',
        },
        {   code: 'NPR',
            text: 'Nepalese Rupee',
        },
        {   code: 'NIO',
            text: 'Cordob Oro',
        },
        {   code: 'NGN',
            text: 'Naira',
        },
        {   code: 'OMR',
            text: 'Rial Omani',
        },
        {   code: 'PKR',
            text: 'Pakistan Rupee',
        },
        {   code: 'PAB',
            text: 'Balboa',
        },
        {   code: 'PGK',
            text: 'Kina',
        },
        {   code: 'PYG',
            text: 'Guarani',
        },
        {   code: 'PEN',
            text: 'Nuevo Sol',
        },
        {   code: 'PHP',
            text: 'Philippine Peso',
        },
        {   code: 'PLN',
            text: 'Zloty',
        },
        {   code: 'QAR',
            text: 'Qatari Rial',
        },
        {   code: 'RON',
            text: 'New Romanian Leu',
        },
        {   code: 'RUB',
            text: 'Russian Ruble',
        },
        {   code: 'RWF',
            text: 'Rwand Franc',
        },
        {   code: 'SHP',
            text: 'Saint Helen Pound',
        },
        {   code: 'WST',
            text: 'Tala',
        },
        {   code: 'STD',
            text: 'Dobra',
        },
        {   code: 'SAR',
            text: 'Saudi Riyal',
        },
        {   code: 'RSD',
            text: 'Serbian Dinar',
        },
        {   code: 'SCR',
            text: 'Seychelles Rupee',
        },
        {   code: 'SLL',
            text: 'Leone',
        },
        {   code: 'SGD',
            text: 'Singapore Dollar',
        },
        {   code: 'XSU',
            text: 'Sucre',
        },
        {   code: 'SBD',
            text: 'Solomon Islands Dollar',
        },
        {   code: 'SOS',
            text: 'Somali Shilling',
        },
        {   code: 'SSP',
            text: 'South Sudanese Pound',
        },
        {   code: 'LKR',
            text: 'Sri Lank Rupee',
        },
        {   code: 'SDG',
            text: 'Sudanese Pound',
        },
        {   code: 'SRD',
            text: 'Surinam Dollar',
        },
        {   code: 'SZL',
            text: 'Lilangeni',
        },
        {   code: 'SEK',
            text: 'Swedish Krona',
        },
        {   code: 'CHE',
            text: 'WIR Euro',
        },
        {   code: 'CHW',
            text: 'WIR Franc',
        },
        {   code: 'SYP',
            text: 'Syrian Pound',
        },
        {   code: 'TWD',
            text: 'New Taiwan Dollar',
        },
        {   code: 'TJS',
            text: 'Somoni',
        },
        {   code: 'TZS',
            text: 'Tanzanian Shilling',
        },
        {   code: 'THB',
            text: 'Baht',
        },
        {   code: 'TOP',
            text: 'Pa’anga',
        },
        {   code: 'TTD',
            text: 'Trinidad nd Tobago Dollar',
        },
        {   code: 'TND',
            text: 'Tunisian Dinar',
        },
        {   code: 'TRY',
            text: 'Turkish Lira',
        },
        {   code: 'TMT',
            text: 'Turkmenistan New Manat',
        },
        {   code: 'UGX',
            text: 'Ugand Shilling',
        },
        {   code: 'UAH',
            text: 'Hryvnia',
        },
        {   code: 'AED',
            text: 'UAE Dirham',
        },
        {   code: 'USN',
            text: 'US Dollar (Next day)',
        },
        {   code: 'UYI',
            text: 'Uruguay Peso en Unidades Indexadas (URUIURUI)',
        },
        {   code: 'UYU',
            text: 'Peso Uruguayo',
        },
        {   code: 'UZS',
            text: 'Uzbekistan Sum',
        },
        {   code: 'VUV',
            text: 'Vatu',
        },
        {   code: 'VEF',
            text: 'Bolivar',
        },
        {   code: 'VND',
            text: 'Dong',
        },
        {   code: 'YER',
            text: 'Yemeni Rial',
        },
        {   code: 'ZMW',
            text: 'Zambian Kwacha',
        },
        {   code: 'ZWL',
            text: 'Zimbabwe Dollar',
        }
    ];
    $scope.selectedCurrency = $scope.currencies[4];
}
]);
