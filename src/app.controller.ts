import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('App')
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): any {
        return this.appService.getHello();
    }

    @Get('test-email')
    @ApiOperation({ summary: 'Send a test email to a single address' })
    @ApiQuery({ name: 'email', required: true, example: 'you@example.com' })
    @ApiQuery({ name: 'secret', required: true, description: 'Value of TEST_EMAIL_SECRET' })
    async testEmail(
        @Query('email') email: string,
        @Query('secret') secret: string,
    ): Promise<any> {
        return this.appService.sendTestEmail(email, secret);
    }

    @Post('test-email/bulk')
    @ApiOperation({ summary: 'Send a test email to multiple addresses' })
    @ApiBody({
        schema: {
            type: 'object',
            required: ['emails', 'secret'],
            properties: {
                emails: { type: 'array', items: { type: 'string' }, example: ['a@example.com', 'b@example.com'] },
                secret: { type: 'string', description: 'Value of TEST_EMAIL_SECRET' },
            },
        },
    })
    async testEmailBulk(
        @Body('emails') emails: string[],
        @Body('secret') secret: string,
    ): Promise<any> {
        return this.appService.sendTestEmailBulk(emails, secret);
    }
}
