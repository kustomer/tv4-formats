describe('tv4-formats', function () {
    'use strict';

    var assert = require('assert'),
        formats = require('../index.js');

    describe('date', function () {
        it('is defined', function () {
            assert.strictEqual(typeof formats.date, 'function');
        });

        it('returns no error for a valid ISO 8601 date', function () {
            assert.strictEqual(formats.date('2014-02-11'), null);
        });

        it('returns no error for a valid leap year date', function () {
            assert.strictEqual(formats.date('2024-02-29'), null);
        });

        it('complains about Feb 29 on a non-leap year', function () {
            assert.strictEqual(formats.date('2023-02-29'), 'A valid date in YYYY-MM-DD format expected');
        });

        it('complains about 30th of February, mentioning the expected format', function () {
            assert(/YYYY-MM-DD/.test(formats.date('2014-02-30')));
        });

        it('complains when the date format is wrong', function () {
            assert(formats.date('11.02.2014').length > 0);
        });

        it('complains when it\'s not a date at all', function () {
            assert(formats.date('BOO!').length > 0);
        });

        it('complains about invalid month 13', function () {
            assert(formats.date('2014-13-01').length > 0);
        });

        it('complains about invalid month 00', function () {
            assert(formats.date('2014-00-15').length > 0);
        });

        it('accepts extended year format with 5 digits', function () {
            assert.strictEqual(formats.date('10000-01-01'), null);
        });

        it('complains on empty string', function () {
            assert(formats.date('').length > 0);
        });
    });

    describe('date-time', function () {
        it('is defined', function () {
            assert.strictEqual(typeof formats['date-time'], 'function');
        });

        it('returns no error for a valid ISO 8601 UTC date and time with a TZ offset 1', function () {
            assert.strictEqual(formats['date-time']('2014-02-11T15:19:59+00:00'), null);
        });

        it('returns no error for a valid ISO 8601 UTC date and time with a TZ offset 2', function () {
            assert.strictEqual(formats['date-time']('2014-02-11T15:19:59+0000'), null);
        });

        it('returns no error for a valid ISO 8601 UTC date and time with a TZ offset 3', function () {
            assert.strictEqual(formats['date-time']('2014-02-11T15:19:59+00'), null);
        });

        it('returns no error for a valid ISO 8601 UTC date and time with no TZ offset', function () {
            assert.strictEqual(formats['date-time']('2014-02-11T15:19:59Z'), null);
        });

        it('returns no error for a valid ISO 8601 UTC date-time with a TZ offset and fractional seconds', function () {
            assert.strictEqual(formats['date-time']('2014-02-11T15:19:59.000+00:00'), null);
        });

        it('returns no error for a negative timezone offset', function () {
            assert.strictEqual(formats['date-time']('2014-02-11T15:19:59-05:30'), null);
        });

        it('returns no error for a positive non-UTC timezone offset', function () {
            assert.strictEqual(formats['date-time']('2014-02-11T15:19:59+05:30'), null);
        });

        it('returns no error for multiple digit fractional seconds', function () {
            assert.strictEqual(formats['date-time']('2014-02-11T15:19:59.123456+00:00'), null);
        });

        it('it complains on garbage', function () {
            assert(formats['date-time']('jsdfhdfsb hjsbdfhbdhbbfd hjsdb').length > 0);
        });

        it('complains on a date-time in a wrong format 1', function () {
            assert(formats['date-time']('2014-02-11 16:31:14').length > 0);
        });

        it('complains on a date-time in a wrong format 2', function () {
            assert(formats['date-time']('2013-W06-5T09:30:26 Z').length > 0);
        });

        it('complains on a date-time in a wrong format 3', function () {
            assert(formats['date-time']('2013-06-05T09:30:26-00000').length > 0);
        });

        it('complains on a date-time in a wrong format 4', function () {
            assert(formats['date-time']('2013-06-05T09:30:26+000:0').length > 0);
        });

        it('complains on empty string', function () {
            assert(formats['date-time']('').length > 0);
        });
    });

    describe('email', function () {
        it('is defined', function () {
            assert.strictEqual(typeof formats.email, 'function');
        });

        it('validates positively', function () {
            assert.strictEqual(formats.email('ivan.krechetov+special-tag@gmail.com'), null);
        });

        it('validates negatively', function () {
            assert(formats.email('#not_an_email').length > 0);
        });

        it('complains on empty string', function () {
            assert(formats.email('').length > 0);
        });
    });

    describe('uri', function () {
        it('is defined', function () {
            assert.strictEqual(typeof formats.uri, 'function');
        });

        it('validates positively', function () {
            assert.strictEqual(formats.uri('http://krechetov.net/'), null);
        });

        it('accepts just a name', function () {
            assert.strictEqual(formats.uri('foobar'), null);
        });

        it('accepts an absolute path', function () {
            assert.strictEqual(formats.uri('/var/log/nginx/access.log'), null);
        });

        it('accepts a ./ relative path', function () {
            assert.strictEqual(formats.uri('./export.xml'), null);
        });

        it('accepts a ../ relative path', function () {
            assert.strictEqual(formats.uri('../export.xml'), null);
        });

        it('accepts URI with query string', function () {
            assert.strictEqual(formats.uri('http://example.com/path?foo=bar&baz=qux'), null);
        });

        it('accepts URI with fragment', function () {
            assert.strictEqual(formats.uri('http://example.com/page#section'), null);
        });

        it('accepts ftp scheme', function () {
            assert.strictEqual(formats.uri('ftp://ftp.example.com/file.txt'), null);
        });

        it('accepts mailto scheme', function () {
            assert.strictEqual(formats.uri('mailto:user@example.com'), null);
        });

        it('accepts file scheme', function () {
            assert.strictEqual(formats.uri('file:///home/user/file.txt'), null);
        });

        it('validates negatively', function () {
            assert(formats.uri('+41 43 000 00 00 Grüezi').length > 0);
        });

        it('accepts empty string as valid relative reference', function () {
            // Empty strings are valid URI relative references per RFC 3986
            assert.strictEqual(formats.uri(''), null);
        });
    });

    describe('url', function () {
        it('is defined', function () {
            assert.strictEqual(typeof formats.url, 'function');
        });

        it('validates positively 1', function () {
            assert.strictEqual(formats.url('https://ikr.su/'), null);
        });

        it('validates positively 2', function () {
            assert.strictEqual(formats.url('http://localhost:3000/'), null);
        });

        it('accepts URL with query parameters', function () {
            assert.strictEqual(formats.url('https://example.com/path?query=1&other=2'), null);
        });

        it('accepts URL with fragment', function () {
            assert.strictEqual(formats.url('https://example.com/page#section'), null);
        });

        it('accepts URL with port and path', function () {
            assert.strictEqual(formats.url('https://example.com:8080/path/to/resource'), null);
        });

        it('accepts URL with IP address', function () {
            assert.strictEqual(formats.url('http://192.168.1.1/'), null);
        });

        it('accepts FTP URL', function () {
            assert.strictEqual(formats.url('ftp://ftp.example.com/file.txt'), null);
        });

        it('validates negatively 1', function () {
            assert(formats.url('http://asdf:3000/').length > 0);
        });

        it('validates negatively 2', function () {
            assert(formats.url('#clearly# :not: a URL').length > 0);
        });

        it('complains on empty string', function () {
            assert(formats.url('').length > 0);
        });
    });

    describe('credit-card-number', function () {
        it('is defined', function () {
            assert.strictEqual(typeof formats['credit-card-number'], 'function');
        });

        it('validates positively', function () {
            assert.strictEqual(formats['credit-card-number']('4242424242424242'), null);
        });

        it('validates Mastercard positively', function () {
            assert.strictEqual(formats['credit-card-number']('5500000000000004'), null);
        });

        it('validates American Express positively', function () {
            assert.strictEqual(formats['credit-card-number']('378282246310005'), null);
        });

        it('validates Discover positively', function () {
            assert.strictEqual(formats['credit-card-number']('6011111111111117'), null);
        });

        it('validates negatively on garbage', function () {
            assert(formats['credit-card-number']('MA CC NUM').length > 0);
        });

        it('validates negatively on a number violating the checksum', function () {
            assert(formats['credit-card-number']('1000000000000000').length > 0);
        });

        it('complains on empty string', function () {
            assert(formats['credit-card-number']('').length > 0);
        });
    });

    describe('duration', function () {
        it('is defined', function () {
            assert.strictEqual(typeof formats.duration, 'function');
        });

        [
            'P1Y', 'P2M', 'P3W', 'P4D', // days
            'PT1H', 'PT2M', 'PT3S', // times
            'P3Y6M4DT12H30M5S', 'P23DT23H', 'P1Y3WT24H', // combined
            'P0.5Y', 'P0,5Y', 'PT0.5H', // fractions
            'P1.5DT2H' // fraction in day part combined with time
        ].forEach(function (validDuration) {
            it('validates valid "' + validDuration + '" duration positively', function () {
                assert.strictEqual(formats.duration(validDuration), null);
            });
        });

        [
            'P1', '2M', 'PW', 'P4D2', 'PT1Y', 'P2S', 'P3Y6M4D12H30M5S', 'PT0.5', ''
        ].forEach(function (invalidDuration) {
            it('validates invalid "' + invalidDuration + '" duration negatively', function () {
                assert(formats.duration(invalidDuration).length);
            });
        });
    });

    describe('time-offset', function () {
        it('is defined', function () {
            assert.strictEqual(typeof formats['time-offset'], 'function');
        });

        [
            'P1Y', '-P1Y3WT24H', 'P0.5Y', '-P0,5Y', 'PT0.5H'
        ].forEach(function (validTimeOffset) {
            it('validates valid "' + validTimeOffset + '" time offset positively', function () {
                assert.strictEqual(formats['time-offset'](validTimeOffset), null);
            });
        });

        [
            'P1', '-PW', 'P4D2', '-P3Y6M4D12H30M5S', ''
        ].forEach(function (invalidTimeOffset) {
            it('validates invalid "' + invalidTimeOffset + '" time offset negatively', function () {
                assert(formats['time-offset'](invalidTimeOffset).length > 0);
            });
        });
    });

    describe('guid', function () {
        it('is defined', function () {
            assert.strictEqual(typeof formats.guid, 'function');
        });

        it('validates positively', function () {
            assert.strictEqual(formats.guid('34f8216d-b4b2-5d4d-b46b-ba1466ea3ab9'), null);
        });

        it('validates uppercase GUID positively', function () {
            assert.strictEqual(formats.guid('34F8216D-B4B2-5D4D-B46B-BA1466EA3AB9'), null);
        });

        it('validates mixed case GUID positively', function () {
            assert.strictEqual(formats.guid('34f8216D-B4b2-5d4D-b46B-Ba1466eA3Ab9'), null);
        });

        it('validates negatively 1', function () {
            assert(formats.guid('34f8216d-xxxx-5d4d-b46b-ba1466ea3ab9').length > 0);
        });

        it('validates negatively 2', function () {
            assert(formats.guid('ikr@ikr.su').length > 0);
        });

        it('accepts optional curlies', function () {
            assert.strictEqual(formats.guid('{7e39b1e6-23d1-11e6-8456-e75e8e0d2af6}'), null);
        });

        it('complains on empty string', function () {
            assert(formats.guid('').length > 0);
        });
    });

    describe('tv4 integration', function () {
        var tv4 = require('tv4').freshApi();
        tv4.addFormat(formats);

        it('validates email format in a schema', function () {
            var schema = { type: 'string', format: 'email' };

            assert(tv4.validate('test@example.com', schema));
            assert(!tv4.validate('not-an-email', schema));
        });

        it('validates date format in a schema', function () {
            var schema = { type: 'string', format: 'date' };

            assert(tv4.validate('2024-02-29', schema));
            assert(!tv4.validate('2023-02-30', schema));
        });

        it('validates date-time format in an object schema', function () {
            var schema = {
                type: 'object',
                properties: {
                    createdAt: { type: 'string', format: 'date-time' }
                },
                required: ['createdAt']
            };

            assert(tv4.validate({ createdAt: '2014-02-11T15:19:59Z' }, schema));
            assert(!tv4.validate({ createdAt: 'not-a-date' }, schema));
        });

        it('validates uri format in a schema', function () {
            var schema = { type: 'string', format: 'uri' };

            assert(tv4.validate('https://example.com/path', schema));
            assert(!tv4.validate('+41 not a uri', schema));
        });

        it('validates url format in a schema', function () {
            var schema = { type: 'string', format: 'url' };

            assert(tv4.validate('https://example.com/', schema));
            assert(!tv4.validate('not-a-url', schema));
        });

        it('validates credit-card-number format in a schema', function () {
            var schema = { type: 'string', format: 'credit-card-number' };

            assert(tv4.validate('4242424242424242', schema));
            assert(!tv4.validate('1234567890', schema));
        });

        it('validates duration format in a schema', function () {
            var schema = { type: 'string', format: 'duration' };

            assert(tv4.validate('P1Y2M3D', schema));
            assert(!tv4.validate('invalid', schema));
        });

        it('validates time-offset format in a schema', function () {
            var schema = { type: 'string', format: 'time-offset' };

            assert(tv4.validate('-P1Y', schema));
            assert(!tv4.validate('invalid', schema));
        });

        it('validates guid format in a schema', function () {
            var schema = { type: 'string', format: 'guid' };

            assert(tv4.validate('34f8216d-b4b2-5d4d-b46b-ba1466ea3ab9', schema));
            assert(!tv4.validate('not-a-guid', schema));
        });

        it('provides error message on validation failure', function () {
            var schema = { type: 'string', format: 'email' };

            tv4.validate('not-an-email', schema);
            assert(tv4.error);
            assert.strictEqual(tv4.error.message, 'Format validation failed (E-mail address expected)');
        });

        it('collects multiple format errors with validateMultiple', function () {
            var schema = {
                    type: 'object',
                    properties: {
                        email: { type: 'string', format: 'email' },
                        website: { type: 'string', format: 'url' },
                        created: { type: 'string', format: 'date' }
                    }
                },
                data = {
                    email: 'not-an-email',
                    website: 'not-a-url',
                    created: 'not-a-date'
                },
                result = tv4.validateMultiple(data, schema);

            assert.strictEqual(result.valid, false);
            assert.strictEqual(result.errors.length, 3);
        });

        it('validates using a registered schema by name', function () {
            var validData = {
                    email: 'test@example.com',
                    createdAt: '2024-01-15T10:30:00Z'
                },
                invalidData = {
                    email: 'not-an-email',
                    createdAt: 'not-a-date'
                },
                validResult,
                invalidResult;

            tv4.addSchema('user', {
                type: 'object',
                properties: {
                    email: { type: 'string', format: 'email' },
                    createdAt: { type: 'string', format: 'date-time' }
                },
                required: ['email', 'createdAt']
            });

            validResult = tv4.validateMultiple(validData, 'user');
            invalidResult = tv4.validateMultiple(invalidData, 'user');

            assert.strictEqual(validResult.valid, true);
            assert.strictEqual(invalidResult.valid, false);
            assert.strictEqual(invalidResult.errors.length, 2);
        });
    });
});
